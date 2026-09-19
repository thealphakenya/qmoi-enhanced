import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel, AutoConfig
from typing import Dict, Any, Optional, List, Tuple
import math

class QMOISparseAttention(nn.Module):
    def __init__(self, config: Dict[str, Any]):
        super().__init__()
        self.num_heads = config['num_attention_heads']
        self.head_dim = config['hidden_size'] // config['num_attention_heads']
        self.scale = self.head_dim ** -0.5
        
        # Projections
        self.q_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.k_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.v_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.out_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        
        # Sparse attention parameters
        self.block_size = config.get('block_size', 64)
        self.num_blocks = config.get('num_blocks', 4)
        self.sparsity_threshold = config.get('sparsity_threshold', 0.1)
        
        self.dropout = nn.Dropout(config.get('dropout', 0.1))

    def forward(self, x: torch.Tensor, mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        batch_size, seq_len, _ = x.shape
        
        # Project queries, keys, and values
        q = self.q_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        k = self.k_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        v = self.v_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        
        # Compute sparse attention
        scores = torch.matmul(q, k.transpose(-2, -1)) * self.scale
        
        # Apply sparsity
        scores = self.apply_sparsity(scores)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        
        # Apply attention
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        output = torch.matmul(attn_weights, v)
        
        # Reshape and project
        output = output.view(batch_size, seq_len, -1)
        output = self.out_proj(output)
        
        return output
    
    def apply_sparsity(self, scores: torch.Tensor) -> torch.Tensor:
        """Apply sparsity to attention scores."""
        # Reshape scores for block processing
        batch_size, seq_len, num_heads, _ = scores.shape
        scores = scores.view(batch_size, seq_len // self.block_size, self.block_size,
                           num_heads, seq_len // self.block_size, self.block_size)
        
        # Apply sparsity threshold
        mask = (scores.abs() > self.sparsity_threshold).float()
        scores = scores * mask
        
        # Reshape back
        scores = scores.view(batch_size, seq_len, num_heads, seq_len)
        return scores

class QMOILongformerAttention(nn.Module):
    def __init__(self, config: Dict[str, Any]):
        super().__init__()
        self.num_heads = config['num_attention_heads']
        self.head_dim = config['hidden_size'] // config['num_attention_heads']
        self.scale = self.head_dim ** -0.5
        
        # Projections
        self.q_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.k_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.v_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.out_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        
        # Longformer parameters
        self.attention_window = config.get('attention_window', 512)
        self.global_attention_size = config.get('global_attention_size', 64)
        
        self.dropout = nn.Dropout(config.get('dropout', 0.1))

    def forward(self, x: torch.Tensor, mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        batch_size, seq_len, _ = x.shape
        
        # Project queries, keys, and values
        q = self.q_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        k = self.k_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        v = self.v_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        
        # Compute local attention
        local_scores = self.compute_local_attention(q, k)
        
        # Compute global attention
        global_scores = self.compute_global_attention(q, k)
        
        # Combine attention scores
        scores = local_scores + global_scores
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        
        # Apply attention
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        output = torch.matmul(attn_weights, v)
        
        # Reshape and project
        output = output.view(batch_size, seq_len, -1)
        output = self.out_proj(output)
        
        return output
    
    def compute_local_attention(self, q: torch.Tensor, k: torch.Tensor) -> torch.Tensor:
        """Compute local attention within the attention window."""
        batch_size, seq_len, num_heads, head_dim = q.shape
        
        # Reshape for local attention
        q = q.view(batch_size, seq_len // self.attention_window, self.attention_window,
                  num_heads, head_dim)
        k = k.view(batch_size, seq_len // self.attention_window, self.attention_window,
                  num_heads, head_dim)
        
        # Compute local attention scores
        scores = torch.matmul(q, k.transpose(-2, -1)) * self.scale
        
        # Reshape back
        scores = scores.view(batch_size, seq_len, num_heads, seq_len)
        return scores
    
    def compute_global_attention(self, q: torch.Tensor, k: torch.Tensor) -> torch.Tensor:
        """Compute global attention for selected tokens."""
        batch_size, seq_len, num_heads, head_dim = q.shape
        
        # Select global attention tokens
        global_indices = torch.arange(0, seq_len, seq_len // self.global_attention_size)
        global_q = q[:, global_indices]
        global_k = k[:, global_indices]
        
        # Compute global attention scores
        scores = torch.matmul(global_q, global_k.transpose(-2, -1)) * self.scale
        
        # Expand to full sequence length
        full_scores = torch.zeros(batch_size, seq_len, num_heads, seq_len,
                                device=scores.device)
        full_scores[:, global_indices] = scores
        
        return full_scores

class QMOIPerformerAttention(nn.Module):
    def __init__(self, config: Dict[str, Any]):
        super().__init__()
        self.num_heads = config['num_attention_heads']
        self.head_dim = config['hidden_size'] // config['num_attention_heads']
        self.scale = self.head_dim ** -0.5
        
        # Projections
        self.q_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.k_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.v_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.out_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        
        # Performer parameters
        self.num_random_features = config.get('num_random_features', 256)
        self.kernel_type = config.get('kernel_type', 'relu')
        
        # Initialize random features
        self.register_buffer('random_features', self.generate_random_features())
        
        self.dropout = nn.Dropout(config.get('dropout', 0.1))

    def forward(self, x: torch.Tensor, mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        batch_size, seq_len, _ = x.shape
        
        # Project queries, keys, and values
        q = self.q_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        k = self.k_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        v = self.v_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        
        # Compute performer attention
        output = self.compute_performer_attention(q, k, v, mask)
        
        # Reshape and project
        output = output.view(batch_size, seq_len, -1)
        output = self.out_proj(output)
        
        return output
    
    def generate_random_features(self) -> torch.Tensor:
        """Generate random features for the performer attention."""
        if self.kernel_type == 'relu':
            return torch.randn(self.num_random_features, self.head_dim)
        else:
            return torch.randn(self.num_random_features, self.head_dim) / math.sqrt(self.head_dim)
    
    def compute_performer_attention(self, q: torch.Tensor, k: torch.Tensor, v: torch.Tensor,
                                  mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        """Compute performer attention using random features."""
        # Project queries and keys to random features
        q_features = torch.matmul(q, self.random_features.transpose(-2, -1))
        k_features = torch.matmul(k, self.random_features.transpose(-2, -1))
        
        # Apply kernel
        if self.kernel_type == 'relu':
            q_features = F.relu(q_features)
            k_features = F.relu(k_features)
        
        # Compute attention
        scores = torch.matmul(q_features, k_features.transpose(-2, -1)) * self.scale
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        output = torch.matmul(attn_weights, v)
        
        return output

class QMOIReformerAttention(nn.Module):
    def __init__(self, config: Dict[str, Any]):
        super().__init__()
        self.num_heads = config['num_attention_heads']
        self.head_dim = config['hidden_size'] // config['num_attention_heads']
        self.scale = self.head_dim ** -0.5
        
        # Projections
        self.q_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.k_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.v_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        self.out_proj = nn.Linear(config['hidden_size'], config['hidden_size'])
        
        # Reformer parameters
        self.bucket_size = config.get('bucket_size', 64)
        self.num_hashes = config.get('num_hashes', 8)
        
        self.dropout = nn.Dropout(config.get('dropout', 0.1))

    def forward(self, x: torch.Tensor, mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        batch_size, seq_len, _ = x.shape
        
        # Project queries, keys, and values
        q = self.q_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        k = self.k_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        v = self.v_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        
        # Compute reformer attention
        output = self.compute_reformer_attention(q, k, v, mask)
        
        # Reshape and project
        output = output.view(batch_size, seq_len, -1)
        output = self.out_proj(output)
        
        return output
    
    def compute_reformer_attention(self, q: torch.Tensor, k: torch.Tensor, v: torch.Tensor,
                                 mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        """Compute reformer attention using LSH."""
        # Compute LSH buckets
        buckets = self.compute_lsh_buckets(q, k)
        
        # Sort queries and keys by bucket
        q_sorted, k_sorted, v_sorted = self.sort_by_bucket(q, k, v, buckets)
        
        # Compute attention within buckets
        scores = torch.matmul(q_sorted, k_sorted.transpose(-2, -1)) * self.scale
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        output = torch.matmul(attn_weights, v_sorted)
        
        return output
    
    def compute_lsh_buckets(self, q: torch.Tensor, k: torch.Tensor) -> torch.Tensor:
        """Compute LSH buckets for queries and keys."""
        # Generate random projection vectors
        proj = torch.randn(self.num_hashes, self.head_dim, device=q.device)
        
        # Project queries and keys
        q_proj = torch.matmul(q, proj.transpose(-2, -1))
        k_proj = torch.matmul(k, proj.transpose(-2, -1))
        
        # Compute buckets
        buckets = (q_proj > 0).long() * (2 ** torch.arange(self.num_hashes, device=q.device))
        buckets = buckets.sum(dim=-1)
        
        return buckets
    
    def sort_by_bucket(self, q: torch.Tensor, k: torch.Tensor, v: torch.Tensor,
                      buckets: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """Sort queries, keys, and values by bucket."""
        # Get sort indices
        _, indices = buckets.sort(dim=1)
        
        # Sort queries, keys, and values
        q_sorted = torch.gather(q, 1, indices.unsqueeze(-1).expand(-1, -1, q.size(-1)))
        k_sorted = torch.gather(k, 1, indices.unsqueeze(-1).expand(-1, -1, k.size(-1)))
        v_sorted = torch.gather(v, 1, indices.unsqueeze(-1).expand(-1, -1, v.size(-1)))
        
        return q_sorted, k_sorted, v_sorted 