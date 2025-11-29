import * as lib from '../lib/qmoi_placeholder_lib.js';
import assert from 'assert';

describe('Placeholder library tests', () => {
  test('AVATAR mapping', () => {
    const mapping = lib.ensureConfigDefaults();
    mapping.avatarConfig = { defaultAvatar: 'qmoi-test' };
    const avatar = lib.applyMapping('AVATAR', mapping);
    expect(avatar).toBe('qmoi-test');
  });

  test('PLACE mapping', () => {
    const mapping = lib.ensureConfigDefaults();
    mapping.places = { places: ['X','Y'] };
    const place = lib.applyMapping('PLACE', mapping);
    expect(['X','Y']).toContain(place);
  });

  test('FACE mapping returns face id or name', () => {
    const mapping = lib.ensureConfigDefaults();
    mapping.faceMappings = { faces: [{ id: 'smile', name: 'Smiling Face', style: 'friendly' }] };
    const face = lib.applyMapping('FACE', mapping);
    expect(['smile','Smiling Face']).toContain(face);
  });

  test('RELEASE mapping', () => {
    const mapping = lib.ensureConfigDefaults();
    mapping.releaseReport = { windows: { status: 'success', file: 'qmoi ai.exe' } };
    const status = lib.applyMapping('RELEASE_WINDOWS_STATUS', mapping);
    expect(status).toBe('success');
  });
});
