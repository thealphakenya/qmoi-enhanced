"""Bridge to transform quantum results into model features and memory entries."""
from typing import Dict, Any

def transform_result_to_features(result: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a raw quantum job result into a small feature dict for model ingestion.

    Example: collapse counts to probability distribution and simple summary stats.
    """
    counts = result.get('counts') or {}
    total = sum(counts.values()) if counts else 0
    probs = {k: v/total for k, v in counts.items()} if total else {}
    most_likely = max(probs.items(), key=lambda kv: kv[1])[0] if probs else None
    features = {
        'quantum_total_counts': total,
        'quantum_top_result': most_likely,
        'quantum_probs': probs,
    }
    return features

if __name__ == '__main__':
    sample = {'counts': {'00': 700, '11': 300}}
    print(transform_result_to_features(sample))
