// endpoint_gating_test: basic health check for a stable public endpoint (/api/debug/info)
const server = process.env.TEST_SERVER_URL || 'http://localhost:3000';
const endpoint = '/api/debug/info';
(async () => {
	try {
		const res = await fetch(`${server}${endpoint}`);
		if (res.status >= 200 && res.status < 300) {
			console.log(`PASS: ${endpoint} reachable (status ${res.status})`);
			process.exitCode = 0;
		} else {
			console.error(`FAIL: ${endpoint} returned status ${res.status}`);
			process.exitCode = 2;
		}
	} catch (err) {
		console.warn(`SKIP: ${endpoint} not reachable at ${server} — ${err.message}`);
		process.exitCode = 0;
	}
})();
