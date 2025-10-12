import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import LambdaLR
from torch.utils.data import DataLoader
from typing import Dict, Any, Optional, List, Tuple
import math
import numpy as np
from transformers import get_linear_schedule_with_warmup
import wandb
from tqdm import tqdm

class QMOITrainer:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.setup_logging()
        self.setup_wandb()
    
    def setup_logging(self):
        """Setup logging configuration."""
        import logging
        logging.basicConfig(
            level=self.config['logging']['level'],
            format=self.config['logging']['format'],
            filename=self.config['logging']['file']
        )
        self.logger = logging.getLogger(__name__)
    
    def setup_wandb(self):
        """Setup Weights & Biases logging."""
        if self.config['wandb']['enabled']:
            wandb.init(
                project=self.config['wandb']['project'],
                entity=self.config['wandb']['entity'],
                config=self.config
            )
    
    def get_optimizer(self, model: nn.Module) -> optim.Optimizer:
        """Get optimizer with advanced settings."""
        # Get optimizer configuration
        opt_config = self.config['optimization']
        
        # Prepare optimizer groups
        no_decay = ['bias', 'LayerNorm.weight']
        optimizer_grouped_parameters = [
            {
                'params': [p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay)],
                'weight_decay': opt_config['weight_decay']
            },
            {
                'params': [p for n, p in model.named_parameters() if any(nd in n for nd in no_decay)],
                'weight_decay': 0.0
            }
        ]
        
        # Create optimizer
        optimizer = optim.AdamW(
            optimizer_grouped_parameters,
            lr=opt_config['learning_rate'],
            betas=(opt_config['adam_beta1'], opt_config['adam_beta2']),
            eps=opt_config['adam_epsilon']
        )
        
        return optimizer
    
    def get_scheduler(self, optimizer: optim.Optimizer, num_training_steps: int) -> LambdaLR:
        """Get learning rate scheduler with advanced settings."""
        # Get scheduler configuration
        scheduler_config = self.config['optimization']
        
        # Create scheduler
        scheduler = get_linear_schedule_with_warmup(
            optimizer,
            num_warmup_steps=int(num_training_steps * scheduler_config['warmup_ratio']),
            num_training_steps=num_training_steps
        )
        
        return scheduler
    
    def apply_mixup(self, inputs: torch.Tensor, labels: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, float]:
        """Apply mixup augmentation."""
        alpha = self.config['training']['mixup_alpha']
        lam = np.random.beta(alpha, alpha)
        
        batch_size = inputs.size(0)
        index = torch.randperm(batch_size).to(inputs.device)
        
        mixed_inputs = lam * inputs + (1 - lam) * inputs[index]
        mixed_labels = lam * labels + (1 - lam) * labels[index]
        
        return mixed_inputs, mixed_labels, lam
    
    def apply_cutmix(self, inputs: torch.Tensor, labels: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, float]:
        """Apply cutmix augmentation."""
        if np.random.random() > self.config['training']['cutmix_prob']:
            return inputs, labels, 1.0
        
        batch_size = inputs.size(0)
        index = torch.randperm(batch_size).to(inputs.device)
        
        # Generate random box
        lam = np.random.beta(1, 1)
        cut_rat = np.sqrt(1. - lam)
        cut_w = int(inputs.size(2) * cut_rat)
        cut_h = int(inputs.size(3) * cut_rat)
        
        # Uniform
        cx = np.random.randint(inputs.size(2))
        cy = np.random.randint(inputs.size(3))
        
        bbx1 = np.clip(cx - cut_w // 2, 0, inputs.size(2))
        bby1 = np.clip(cy - cut_h // 2, 0, inputs.size(3))
        bbx2 = np.clip(cx + cut_w // 2, 0, inputs.size(2))
        bby2 = np.clip(cy + cut_h // 2, 0, inputs.size(3))
        
        # Apply cutmix
        inputs[:, :, bbx1:bbx2, bby1:bby2] = inputs[index, :, bbx1:bbx2, bby1:bby2]
        lam = 1 - ((bbx2 - bbx1) * (bby2 - bby1) / (inputs.size(2) * inputs.size(3)))
        
        return inputs, labels, lam
    
    def apply_label_smoothing(self, labels: torch.Tensor) -> torch.Tensor:
        """Apply label smoothing."""
        smoothing = self.config['training']['label_smoothing']
        num_classes = labels.size(-1)
        
        smooth_labels = labels * (1 - smoothing) + smoothing / num_classes
        return smooth_labels
    
    def apply_gradient_clipping(self, model: nn.Module):
        """Apply gradient clipping."""
        max_grad_norm = self.config['optimization']['max_grad_norm']
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_grad_norm)
    
    def train_epoch(self, model: nn.Module, train_loader: DataLoader, optimizer: optim.Optimizer, scheduler: LambdaLR) -> float:
        """Train for one epoch with advanced techniques."""
        model.train()
        total_loss = 0
        
        for batch in tqdm(train_loader, desc="Training"):
            # Get inputs and labels
            inputs = batch['input_ids'].to(model.device)
            labels = batch['labels'].to(model.device)
            
            # Apply augmentations
            if self.config['training']['use_mixup']:
                inputs, labels, lam = self.apply_mixup(inputs, labels)
            elif self.config['training']['use_cutmix']:
                inputs, labels, lam = self.apply_cutmix(inputs, labels)
            
            # Apply label smoothing
            if self.config['training']['use_label_smoothing']:
                labels = self.apply_label_smoothing(labels)
            
            # Forward pass
            outputs = model(inputs)
            loss = self.compute_loss(outputs, labels)
            
            # Backward pass
            optimizer.zero_grad()
            loss.backward()
            
            # Apply gradient clipping
            self.apply_gradient_clipping(model)
            
            # Update parameters
            optimizer.step()
            scheduler.step()
            
            # Update metrics
            total_loss += loss.item()
            
            # Log to wandb
            if self.config['wandb']['enabled']:
                wandb.log({
                    'train_loss': loss.item(),
                    'learning_rate': scheduler.get_last_lr()[0]
                })
        
        return total_loss / len(train_loader)
    
    def evaluate(self, model: nn.Module, eval_loader: DataLoader) -> Dict[str, float]:
        """Evaluate the model with advanced metrics."""
        model.eval()
        total_loss = 0
        all_predictions = []
        all_labels = []
        
        with torch.no_grad():
            for batch in tqdm(eval_loader, desc="Evaluating"):
                # Get inputs and labels
                inputs = batch['input_ids'].to(model.device)
                labels = batch['labels'].to(model.device)
                
                # Forward pass
                outputs = model(inputs)
                loss = self.compute_loss(outputs, labels)
                
                # Update metrics
                total_loss += loss.item()
                all_predictions.extend(outputs.argmax(dim=-1).cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
        
        # Compute metrics
        metrics = self.compute_metrics(all_predictions, all_labels)
        metrics['eval_loss'] = total_loss / len(eval_loader)
        
        # Log to wandb
        if self.config['wandb']['enabled']:
            wandb.log(metrics)
        
        return metrics
    
    def compute_loss(self, outputs: torch.Tensor, labels: torch.Tensor) -> torch.Tensor:
        """Compute loss with advanced techniques."""
        if self.config['training']['use_focal_loss']:
            return self.focal_loss(outputs, labels)
        else:
            return F.cross_entropy(outputs, labels)
    
    def focal_loss(self, outputs: torch.Tensor, labels: torch.Tensor) -> torch.Tensor:
        """Compute focal loss."""
        gamma = self.config['training']['focal_loss_gamma']
        alpha = self.config['training']['focal_loss_alpha']
        
        ce_loss = F.cross_entropy(outputs, labels, reduction='none')
        pt = torch.exp(-ce_loss)
        focal_loss = alpha * (1 - pt) ** gamma * ce_loss
        
        return focal_loss.mean()
    
    def compute_metrics(self, predictions: List[int], labels: List[int]) -> Dict[str, float]:
        """Compute advanced metrics."""
        from sklearn.metrics import accuracy_score, precision_recall_fscore_support, roc_auc_score
        
        metrics = {}
        
        # Basic metrics
        metrics['accuracy'] = accuracy_score(labels, predictions)
        
        # Precision, recall, F1
        precision, recall, f1, _ = precision_recall_fscore_support(
            labels, predictions, average='weighted'
        )
        metrics['precision'] = precision
        metrics['recall'] = recall
        metrics['f1'] = f1
        
        # ROC AUC
        try:
            metrics['roc_auc'] = roc_auc_score(labels, predictions)
        except:
            metrics['roc_auc'] = 0.0
        
        return metrics
    
    def train(self, model: nn.Module, train_loader: DataLoader, eval_loader: DataLoader):
        """Train the model with advanced techniques."""
        # Get optimizer and scheduler
        optimizer = self.get_optimizer(model)
        scheduler = self.get_scheduler(optimizer, len(train_loader) * self.config['training']['num_epochs'])
        
        # Training loop
        best_metric = float('inf')
        for epoch in range(self.config['training']['num_epochs']):
            # Train epoch
            train_loss = self.train_epoch(model, train_loader, optimizer, scheduler)
            
            # Evaluate
            metrics = self.evaluate(model, eval_loader)
            
            # Log epoch results
            self.logger.info(f"Epoch {epoch + 1}:")
            self.logger.info(f"Train Loss: {train_loss:.4f}")
            self.logger.info(f"Eval Loss: {metrics['eval_loss']:.4f}")
            self.logger.info(f"Accuracy: {metrics['accuracy']:.4f}")
            
            # Save best model
            if metrics['eval_loss'] < best_metric:
                best_metric = metrics['eval_loss']
                self.save_model(model, 'best_model.pt')
            
            # Save checkpoint
            self.save_checkpoint(model, optimizer, scheduler, epoch, metrics, f'checkpoint_{epoch}.pt')
    
    def save_model(self, model: nn.Module, path: str):
        """Save model with advanced features."""
        # Save model state
        torch.save({
            'model_state_dict': model.state_dict(),
            'config': self.config
        }, path)
        
        # Log to wandb
        if self.config['wandb']['enabled']:
            wandb.save(path)
    
    def save_checkpoint(self, model: nn.Module, optimizer: optim.Optimizer, scheduler: LambdaLR, epoch: int, metrics: Dict[str, float], path: str):
        """Save training checkpoint."""
        torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'scheduler_state_dict': scheduler.state_dict(),
            'metrics': metrics,
            'config': self.config
        }, path)
        
        # Log to wandb
        if self.config['wandb']['enabled']:
            wandb.save(path)
    
    def load_checkpoint(self, model: nn.Module, path: str) -> Tuple[optim.Optimizer, LambdaLR, int, Dict[str, float]]:
        """Load training checkpoint."""
        checkpoint = torch.load(path)
        
        # Load model state
        model.load_state_dict(checkpoint['model_state_dict'])
        
        # Get optimizer and scheduler
        optimizer = self.get_optimizer(model)
        scheduler = self.get_scheduler(optimizer, len(train_loader) * self.config['training']['num_epochs'])
        
        # Load optimizer and scheduler state
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        scheduler.load_state_dict(checkpoint['scheduler_state_dict'])
        
        return optimizer, scheduler, checkpoint['epoch'], checkpoint['metrics'] 