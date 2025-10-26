import { parentPort, workerData } from 'worker_threads';
import path from 'path';

// Restore environment variables
for (const [key, value] of Object.entries(workerData.environment)) {
  process.env[key] = value;
}

async function runTest() {
  try {
    const testModule = await import(workerData.testFile);
    const result = await testModule.default();

    parentPort.postMessage({
      file: path.relative(process.cwd(), workerData.testFile),
      success: true,
      result,
      duration: result.duration,
      retries: 0
    });
  } catch (err) {
    parentPort.postMessage({
      file: path.relative(process.cwd(), workerData.testFile),
      success: false,
      error: err.message,
      stack: err.stack,
      retries: 0
    });
  }
}

runTest().catch(err => {
  console.error(`Worker error in ${workerData.testFile}:`, err);
  process.exit(1);
});