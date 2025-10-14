const fs = require('fs');
const path = require('path');

describe('Qmoispace Secrets Security', () => {
  it('should not expose raw secrets in .env', () => {
    const env = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    expect(env).not.toMatch(/(SECRET|API_KEY|TOKEN|PASSWORD)=.{10,}/i);
  });
}); 