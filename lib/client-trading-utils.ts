export function calculateScalingFactor(confidence: number) {
  if (confidence > 0.9) return 3;
  if (confidence > 0.8) return 2;
  return 1;
}

export function formatConfidence(conf: number) {
  return `${(conf * 100).toFixed(1)}%`;
}
