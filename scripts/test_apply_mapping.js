#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function loadJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

const avatarConfig = loadJSON(path.join('config', 'avatar-config.json')) || {};
const placeMappings = loadJSON(path.join('config', 'place-mappings.json')) || { places: [] };
const faceMappings = loadJSON(path.join('config', 'face-mappings.json')) || { faces: [] };

console.log('Avatar default:', avatarConfig.defaultAvatar);
console.log('First place:', placeMappings.places[0]);
console.log('Face samples:', faceMappings.faces.slice(0,3));

console.log('Mapping test complete');
