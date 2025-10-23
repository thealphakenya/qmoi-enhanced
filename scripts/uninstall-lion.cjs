#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dest = path.join(process.cwd(), 'bin', 'lion');
if (fs.existsSync(dest)) {
  fs.unlinkSync(dest);
  console.log('Removed', dest);
} else {
  console.log('Lion not installed at', dest);
}
