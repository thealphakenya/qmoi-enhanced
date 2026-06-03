import hasAccessHandler from '../../pages/api/auth/hasAccess';
import registerHandler from '../../pages/api/auth/register';
import loginHandler from '../../pages/api/auth/login';

function createMockReqRes(method: string, body?: any, query?: any, headers?: any) {
  const req: any = { method, body: body || {}, query: query || {}, headers: headers || {}, socket: { remoteAddress: '127.0.0.1' } };
  let statusCode = 200;
  const res: any = { status(code: number) { statusCode = code; return this; }, json(payload: any) { return { statusCode, payload }; } };
  return { req, res };
}

describe('hasAccess endpoint', () => {
  test('register -> login -> hasAccess for trading feature', async () => {
    const username = `access_${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'AccessPass1!';

    const { req: r1, res: s1 } = createMockReqRes('POST', { username, email, password });
    // @ts-ignore
    await registerHandler(r1, s1);

    const { req: r2, res: s2 } = createMockReqRes('POST', { email, password }, undefined, { 'user-agent': 'jest' });
    // @ts-ignore
    const login = await loginHandler(r2, s2);
    const loginResp = login.payload || login;
    const session = loginResp.session;
    expect(session).toBeDefined();

    const { req: r3, res: s3 } = createMockReqRes('POST', { token: session.id, feature: 'trading' });
    // @ts-ignore
    const access = await hasAccessHandler(r3, s3);
    const accessResp = access.payload || access;
    expect(accessResp.allowed).toBe(false);
  });
});
