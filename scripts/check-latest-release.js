// scripts/check-latest-release.js
import axios from 'axios';

const repo = 'thealphakenya/Alpha-Q-ai';

async function checkRelease() {
  try {
    const res = await axios.get(`https://api.github.com/repos/${repo}/releases/latest`);
    const latest = res.data.tag_name || res.data.name;
    console.log(`🚀 Latest QMOI Release: ${latest}`);
  } catch (e) {
    console.error('❌ Could not fetch release info:', e.message);
  }
}

checkRelease();
