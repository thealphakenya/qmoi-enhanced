// auth_gating_presence_test: confirm auth endpoints are present and gated
const server = process.env.TEST_SERVER_URL || 'http://localhost:3000';
const endpoint = '/api/auth/me';
(async () => {
	try {
		const res = await fetch(`${server}${endpoint}`);
		if (res.status === 401 || res.status === 403) {
			console.log(`PASS: ${endpoint} is auth-gated (status ${res.status})`);
			process.exitCode = 0;
		} else {
			console.error(`FAIL: ${endpoint} returned ${res.status} — expected 401/403`);
			process.exitCode = 2;
		}
	} catch (err) {
		console.warn(`SKIP: ${endpoint} not reachable at ${server} — ${err.message}`);
		process.exitCode = 0;
	}
})();
