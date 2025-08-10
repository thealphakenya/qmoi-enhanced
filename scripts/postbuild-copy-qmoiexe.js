import fs from 'fs';
import path from 'path';

const source = path.join(__dirname, '..', 'qmoiexe.exe');
const destination = path.join(__dirname, '..', 'Qmoi_apps', 'windows', 'qmoiexe.exe');

if (fs.existsSync(source)) {
  fs.copyFileSync(source, destination);
  console.log('✅ qmoiexe.exe copied to Windows output folder.');
} else {
  console.warn('⚠️ qmoiexe.exe not found. Skipped copy.');
}
