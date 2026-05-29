import registerHandler from '../../pages/api/auth/register';
import loginHandler from '../../pages/api/auth/login';
import sessionHandler from '../../pages/api/auth/session';
import preferencesHandler from '../../pages/api/auth/preferences';

function createMockReqRes(method: string, body?: any, query?: any, headers?: any) {
  const req: any = {
    method,
    body: body || {},
    query: query || {},
    headers: headers || {},
    socket: { remoteAddress: '127.0.0.1' },
  };

  let statusCode = 200;
  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: any) {
      return { statusCode, payload };
    },
  };

  return { req, res };
}

describe('Auth API handlers (smoke)', () => {
  jest.setTimeout(10000);

  test('register -> login -> session -> logout flows', async () => {
    const username = `testuser_${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'S3cureP@ssw0rd!';

    // register
    const { req: r1, res: s1 } = createMockReqRes('POST', { username, email, password });
    // @ts-ignore
    const reg = await registerHandler(r1, s1);
    expect(reg.payload || reg).toBeDefined();

    // login
    const { req: r2, res: s2 } = createMockReqRes('POST', { email, password }, undefined, { 'user-agent': 'jest' });
    // @ts-ignore
    const login = await loginHandler(r2, s2);
    const loginResp = login.payload || login;
    expect(loginResp).toBeDefined();
    const session = loginResp.session;
    expect(session).toBeDefined();

    // session validate
    const { req: r3, res: s3 } = createMockReqRes('GET', undefined, { token: session.id });
    // @ts-ignore
    const sess = await sessionHandler(r3, s3);
    const sessResp = sess.payload || sess;
    expect(sessResp).toBeDefined();
    expect(sessResp.user).toBeDefined();

    // update preferences
    const { req: r4, res: s4 } = createMockReqRes('POST', { token: session.id, preferences: { theme: 'dark', notifications: false } });
    // @ts-ignore
    const prefs = await preferencesHandler(r4, s4);
    const prefsResp = prefs.payload || prefs;
    expect(prefsResp).toBeDefined();
    expect(prefsResp.user).toBeDefined();

    // logout
    const { req: r5, res: s5 } = createMockReqRes('POST', { action: 'logout', token: session.id });
    // @ts-ignore
    const out = await sessionHandler(r5, s5);
    const outResp = out.payload || out;
    expect(outResp).toBeDefined();
    expect(outResp.success || outResp.payload?.success).toBeTruthy();
  });
});
# ARCHIVED NON-PRODUCTION FILE
This file was identified as high-confidence non-production (mock/fixture/sample) and archived.
Backup path: .backups/high_conf_nonprod_1779517012/__tests__/api/auth.test.ts
