#!/usr/bin/env node
const required = [
  'NODE_ENV',
  'GH_TOKEN',
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_SHORTCODE',
  'DATA_DIR'
];

const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Missing required environment variables: ' + missing.join(', '));
  process.exit(2);
}
console.log('All required environment variables are present.');
process.exit(0);
