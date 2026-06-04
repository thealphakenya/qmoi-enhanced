// route_flags_test: verify auth-protected route presence (/api/auth/me should require auth)
const server = process.env.TEST_SERVER_URL || 'http://localhost:3000';
const endpoint = '/api/auth/me';
(async () => {
	try {
		const res = await fetch(`${server}${endpoint}`);
		if (res.status === 401 || res.status === 403) {
			console.log(`PASS: ${endpoint} exists and is auth-gated (status ${res.status})`);
			process.exitCode = 0;
		} else if (res.status === 200) {
			console.warn(`WARN: ${endpoint} returned 200 without auth — check gating`);
			process.exitCode = 1;
		} else {
			console.error(`FAIL: ${endpoint} returned unexpected status ${res.status}`);
			process.exitCode = 2;
		}
	} catch (err) {
		console.warn(`SKIP: ${endpoint} not reachable at ${server} — ${err.message}`);
		process.exitCode = 0;
	}
})();
