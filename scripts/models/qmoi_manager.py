import torch
import torch.nn as nn
import torch.optim as optim
from transformers import AutoModel, AutoTokenizer, AutoConfig
from transformers import Trainer, TrainingArguments
from datasets import load_dataset, Dataset
import numpy as np
from typing import Dict, List, Any, Optional, Union
import logging
import json
import os
from pathlib import Path
import huggingface_hub
from datetime import datetime
import wandb
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import pandas as pd
from tqdm import tqdm
import requests
import hashlib
import shutil
from .qmoi_kernel import start_kernel_thread, log, state, CONFIG

class QMOIModel(nn.Module):
    def __init__(self, config: Dict[str, Any]):
        super().__init__()
        self.config = config
        
        # Load base model
        self.base_model = AutoModel.from_pretrained(config['base_model'])
        
        # Add custom layers
        self.custom_layers = nn.ModuleDict({
            'attention': nn.MultiheadAttention(
                embed_dim=config['hidden_size'],
                num_heads=config['num_attention_heads']
            ),
            'feedforward': nn.Sequential(
                nn.Linear(config['hidden_size'], config['intermediate_size']),
                nn.GELU(),
                nn.Linear(config['intermediate_size'], config['hidden_size'])
            ),
            'layer_norm': nn.LayerNorm(config['hidden_size'])
        })
        
        # Task-specific heads
        self.task_heads = nn.ModuleDict({
            'classification': nn.Linear(config['hidden_size'], config['num_labels']),
            'regression': nn.Linear(config['hidden_size'], 1),
            'generation': nn.Linear(config['hidden_size'], config['vocab_size'])
        })
        
        # Initialize weights
        self._init_weights()
    
    def _init_weights(self):
        """Initialize model weights"""
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                if module.bias is not None:
                    nn.init.zeros_(module.bias)
    
    def forward(self, input_ids: torch.Tensor, attention_mask: torch.Tensor, task: str = 'classification'):
        # Get base model outputs
        outputs = self.base_model(input_ids=input_ids, attention_mask=attention_mask)
        hidden_states = outputs.last_hidden_state
        
        # Apply custom attention
        attn_output, _ = self.custom_layers['attention'](
            hidden_states, hidden_states, hidden_states
        )
        
        # Apply feedforward
        ff_output = self.custom_layers['feedforward'](attn_output)
        
        # Apply layer norm
        normalized = self.custom_layers['layer_norm'](ff_output + attn_output)
        
        # Get task-specific output
        if task == 'classification':
            return self.task_heads['classification'](normalized[:, 0])
        elif task == 'regression':
            return self.task_heads['regression'](normalized[:, 0])
        elif task == 'generation':
            return self.task_heads['generation'](normalized)
        else:
            raise ValueError(f"Unknown task: {task}")

class QMOIManager:
    def __init__(self, config_path: str = 'config/qmoi_config.json'):
        self.logger = logging.getLogger(__name__)
        self.setup_logging()
        self.load_config(config_path)
        self.setup_huggingface()
        self.setup_wandb()
        self.model = None
        self.tokenizer = None
        self.trainer = None
    
    def setup_logging(self):
        """Setup logging configuration"""
        log_dir = Path('logs')
        log_dir.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/qmoi.log'),
                logging.StreamHandler()
            ]
        )
    
    def load_config(self, config_path: str):
        """Load QMOI configuration"""
        try:
            with open(config_path) as f:
                self.config = json.load(f)
        except FileNotFoundError:
            self.logger.warning(f"QMOI config not found at {config_path}, using defaults")
            self.config = {
                'base_model': 'gpt2',
                'hidden_size': 768,
                'num_attention_heads': 12,
                'intermediate_size': 3072,
                'num_labels': 2,
                'vocab_size': 50257,
                'training': {
                    'batch_size': 32,
                    'learning_rate': 2e-5,
                    'num_epochs': 3,
                    'warmup_steps': 500,
                    'weight_decay': 0.01
                },
                'optimization': {
                    'gradient_accumulation_steps': 1,
                    'fp16': True,
                    'max_grad_norm': 1.0
                },
                'monitoring': {
                    'metrics_interval': 100,
                    'save_interval': 1000,
                    'eval_interval': 500
                }
            }
    
    def setup_huggingface(self):
        """Setup HuggingFace integration"""
        try:
            huggingface_hub.login(token=self.config.get('hf_token'))
            self.repo_id = self.config.get('repo_id', 'your-username/qmoi')
        except Exception as e:
            self.logger.error(f"Error setting up HuggingFace: {str(e)}")
    
    def setup_wandb(self):
        """Setup Weights & Biases integration"""
        try:
            wandb.init(
                project=self.config.get('wandb_project', 'qmoi'),
                config=self.config
            )
        except Exception as e:
            self.logger.error(f"Error setting up W&B: {str(e)}")
    
    def load_model(self, model_path: Optional[str] = None):
        """Load QMOI model"""
        try:
            if model_path:
                self.model = QMOIModel.load_pretrained(model_path)
            else:
                self.model = QMOIModel(self.config)
            
            self.tokenizer = AutoTokenizer.from_pretrained(self.config['base_model'])
            self.logger.info("Model loaded successfully")
        except Exception as e:
            self.logger.error(f"Error loading model: {str(e)}")
            raise
    
    def prepare_dataset(self, data_path: str, task: str = 'classification'):
        """Prepare dataset for training"""
        try:
            dataset = load_dataset(data_path)
            
            def preprocess_function(examples):
                return self.tokenizer(
                    examples['text'],
                    padding='max_length',
                    truncation=True,
                    max_length=self.config['max_length']
                )
            
            tokenized_dataset = dataset.map(
                preprocess_function,
                batched=True,
                remove_columns=dataset['train'].column_names
            )
            
            return tokenized_dataset
        except Exception as e:
            self.logger.error(f"Error preparing dataset: {str(e)}")
            raise
    
    def train(self, dataset: Dataset, task: str = 'classification'):
        """Train QMOI model"""
        try:
            training_args = TrainingArguments(
                output_dir='models/qmoi',
                num_train_epochs=self.config['training']['num_epochs'],
                per_device_train_batch_size=self.config['training']['batch_size'],
                learning_rate=self.config['training']['learning_rate'],
                warmup_steps=self.config['training']['warmup_steps'],
                weight_decay=self.config['training']['weight_decay'],
                gradient_accumulation_steps=self.config['optimization']['gradient_accumulation_steps'],
                fp16=self.config['optimization']['fp16'],
                max_grad_norm=self.config['optimization']['max_grad_norm'],
                logging_steps=self.config['monitoring']['metrics_interval'],
                save_steps=self.config['monitoring']['save_interval'],
                eval_steps=self.config['monitoring']['eval_interval'],
                evaluation_strategy='steps',
                load_best_model_at_end=True,
                metric_for_best_model='accuracy'
            )
            
            def compute_metrics(eval_pred):
                predictions, labels = eval_pred
                predictions = np.argmax(predictions, axis=1)
                
                precision, recall, f1, _ = precision_recall_fscore_support(
                    labels, predictions, average='weighted'
                )
                accuracy = accuracy_score(labels, predictions)
                
                return {
                    'accuracy': accuracy,
                    'precision': precision,
                    'recall': recall,
                    'f1': f1
                }
            
            self.trainer = Trainer(
                model=self.model,
                args=training_args,
                train_dataset=dataset['train'],
                eval_dataset=dataset['validation'],
                compute_metrics=compute_metrics
            )
            
            self.trainer.train()
            self.logger.info("Training completed successfully")
        except Exception as e:
            self.logger.error(f"Error during training: {str(e)}")
            raise
    
    def evaluate(self, dataset: Dataset):
        """Evaluate QMOI model"""
        try:
            results = self.trainer.evaluate(dataset)
            self.logger.info(f"Evaluation results: {results}")
            return results
        except Exception as e:
            self.logger.error(f"Error during evaluation: {str(e)}")
            raise
    
    def predict(self, text: str, task: str = 'classification'):
        """Make predictions with QMOI model"""
        try:
            inputs = self.tokenizer(
                text,
                padding='max_length',
                truncation=True,
                max_length=self.config['max_length'],
                return_tensors='pt'
            )
            
            with torch.no_grad():
                outputs = self.model(**inputs, task=task)
            
            if task == 'classification':
                predictions = torch.softmax(outputs, dim=-1)
                return predictions.numpy()
            elif task == 'regression':
                return outputs.numpy()
            elif task == 'generation':
                return self.tokenizer.decode(
                    torch.argmax(outputs, dim=-1)[0],
                    skip_special_tokens=True
                )
        except Exception as e:
            self.logger.error(f"Error during prediction: {str(e)}")
            raise
    
    def save_model(self, path: str):
        """Save QMOI model"""
        try:
            self.model.save_pretrained(path)
            self.tokenizer.save_pretrained(path)
            self.logger.info(f"Model saved to {path}")
        except Exception as e:
            self.logger.error(f"Error saving model: {str(e)}")
            raise
    
    def push_to_hub(self, commit_message: str = "Update model"):
        """Push model to HuggingFace Hub"""
        try:
            self.model.push_to_hub(
                self.repo_id,
                commit_message=commit_message
            )
            self.tokenizer.push_to_hub(
                self.repo_id,
                commit_message=commit_message
            )
            self.logger.info("Model pushed to HuggingFace Hub")
        except Exception as e:
            self.logger.error(f"Error pushing to Hub: {str(e)}")
            raise
    
    def optimize_model(self):
        """Optimize model performance"""
        try:
            # Quantization
            self.model = torch.quantization.quantize_dynamic(
                self.model,
                {torch.nn.Linear},
                dtype=torch.qint8
            )
            
            # Pruning
            for name, module in self.model.named_modules():
                if isinstance(module, nn.Linear):
                    prune_linear = torch.nn.utils.prune.l1_unstructured
                    prune_linear(module, name='weight', amount=0.3)
            
            # JIT compilation
            self.model = torch.jit.script(self.model)
            
            self.logger.info("Model optimization completed")
        except Exception as e:
            self.logger.error(f"Error optimizing model: {str(e)}")
            raise
    
    def monitor_performance(self):
        """Monitor model performance"""
        try:
            metrics = {
                'inference_time': [],
                'memory_usage': [],
                'accuracy': [],
                'throughput': []
            }
            
            # Monitor inference time
            start_time = time.time()
            _ = self.predict("Test input")
            inference_time = time.time() - start_time
            metrics['inference_time'].append(inference_time)
            
            # Monitor memory usage
            memory_usage = torch.cuda.memory_allocated() / 1024**2
            metrics['memory_usage'].append(memory_usage)
            
            # Log metrics to W&B
            wandb.log(metrics)
            
            return metrics
        except Exception as e:
            self.logger.error(f"Error monitoring performance: {str(e)}")
            raise
    
    def update_model(self, new_data: Dataset):
        """Update model with new data"""
        try:
            # Fine-tune on new data
            self.train(new_data)
            
            # Evaluate updated model
            results = self.evaluate(new_data)
            
            # Push to Hub if performance improved
            if results['accuracy'] > self.config.get('min_accuracy', 0.8):
                self.push_to_hub("Update model with new data")
            
            self.logger.info("Model updated successfully")
        except Exception as e:
            self.logger.error(f"Error updating model: {str(e)}")
            raise
    
    def export_model(self, format: str = 'onnx'):
        """Export model to different formats"""
        try:
            if format == 'onnx':
                torch.onnx.export(
                    self.model,
                    torch.randn(1, self.config['max_length']),
                    'models/qmoi.onnx',
                    input_names=['input_ids'],
                    output_names=['output'],
                    dynamic_axes={
                        'input_ids': {0: 'batch_size'},
                        'output': {0: 'batch_size'}
                    }
                )
            elif format == 'torchscript':
                torch.jit.save(
                    torch.jit.script(self.model),
                    'models/qmoi.pt'
                )
            else:
                raise ValueError(f"Unsupported format: {format}")
            
            self.logger.info(f"Model exported to {format}")
        except Exception as e:
            self.logger.error(f"Error exporting model: {str(e)}")
            raise

def start_qmoi_kernel():
    """Start the QMOI kernel background thread."""
    start_kernel_thread()
    log("QMOI kernel started by manager.")

def get_qmoi_status():
    """Return current QMOI kernel status and state."""
    return {
        'status': 'running',
        'last_check': state.get('last_check'),
        'replicated_nodes': state.get('replicated_nodes'),
        'payload_activity': state.get('payload_activity'),
        'mutation_count': state.get('mutation_count'),
    }

def run_qmoi_payload(payload_name):
    """Run a specific QMOI payload by name (if allowed)."""
    if payload_name == 'qfix':
        from .qmoi_kernel import qfix
        qfix()
    elif payload_name == 'qoptimize':
        from .qmoi_kernel import qoptimize
        qoptimize()
    elif payload_name == 'qsecure':
        from .qmoi_kernel import qsecure
        qsecure()
    else:
        log(f"Unknown payload: {payload_name}")
        return False
    return True 