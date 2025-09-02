const { autoDetectProvider, setCurrentProvider, getCurrentProvider, providers } = require('../../huggingface_space/inferenceProviders');

describe('Inference Provider Integration', () => {
  it('should auto-detect and select a provider', () => {
    const provider = autoDetectProvider();
    expect(providers).toContainEqual(provider);
  });
  it('should set and get current provider', () => {
    setCurrentProvider('local');
    expect(getCurrentProvider().id).toBe('local');
  });
}); 