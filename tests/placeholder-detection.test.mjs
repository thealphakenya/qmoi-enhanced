import * as lib from '../lib/qmoi_placeholder_lib.js';

describe('Placeholder detection tests', () => {
  test('deny list contains TODO', () => {
    const pconf = lib.loadPlaceholderConfig();
    expect(pconf.denyList).toContain('TODO');
  });

  test('isDenied returns true for TODO', () => {
    const pconf = lib.loadPlaceholderConfig();
    expect(lib.isDenied('TODO', pconf)).toBe(true);
  });
});
