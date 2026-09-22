import fetch from 'node-fetch';

async function testUrl(url) {
  try {
    const res = await fetch(url, { timeout: 10000 });
    if (res.ok) {
      console.log(`✅ ${url} OK`);
      return true;
    } else {
      console.log(`❌ ${url} BAD STATUS: ${res.status}`);
      return false;
    }
  } catch (e) {
    console.log(`❌ ${url} ERROR: ${e.message}`);
    return false;
  }
}

async function main() {
  let allOk = true;
  // 1. Critical download links (add more as needed)
  const urls = [
    "https://downloads.qmoi.app/qmoi/windows.exe",
    "https://downloads.qmoi.app/qcity/windows.exe",
    "https://downloads.qmoi.app/qstore/qstore-universal.apk"
  ];
  for (const url of urls) {
    if (!(await testUrl(url))) {
      allOk = false;
    }
  }

  // 2. Dashboard (if running)
  const dashboardUrl = "http://localhost:3010";
  try {
    await fetch(dashboardUrl, { timeout: 5000 });
    console.log(`✅ Dashboard reachable at ${dashboardUrl}`);
  } catch {
    console.log(`⚠️ Dashboard not reachable at ${dashboardUrl} (may be expected if not running)`);
  }

  if (allOk) {
    console.log("✅ All autotests passed!");
    process.exit(0);
  } else {
    console.log("❌ Some autotests failed!");
    process.exit(1);
  }
}

main(); 