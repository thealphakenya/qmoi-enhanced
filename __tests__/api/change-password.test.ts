import changePasswordHandler from '../../pages/api/auth/change-password';
import registerHandler from '../../pages/api/auth/register';
import loginHandler from '../../pages/api/auth/login';

function createMockReqRes(method: string, body?: any, query?: any, headers?: any) {
  const req: any = { method, body: body || {}, query: query || {}, headers: headers || {}, socket: { remoteAddress: '127.0.0.1' } };
  let statusCode = 200;
  const res: any = { status(code: number) { statusCode = code; return this; }, json(payload: any) { return { statusCode, payload }; } };
  return { req, res };
}

describe('change-password endpoint', () => {
  test('register -> login -> change password -> login with new password', async () => {
    const username = `cp_${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'Initial1!';

    // register
    const { req: r1, res: s1 } = createMockReqRes('POST', { username, email, password });
    // @ts-ignore
    await registerHandler(r1, s1);

    // login
    const { req: r2, res: s2 } = createMockReqRes('POST', { email, password }, undefined, { 'user-agent': 'jest' });
    // @ts-ignore
    const login = await loginHandler(r2, s2);
    const loginResp = login.payload || login;
    const session = loginResp.session;
    expect(session).toBeDefined();

    // change password
    const newPassword = 'NewPass2!';
    const { req: r3, res: s3 } = createMockReqRes('POST', { token: session.id, currentPassword: password, newPassword });
    // @ts-ignore
    const ch = await changePasswordHandler(r3, s3);
    const chResp = ch.payload || ch;
    expect(chResp.success).toBeTruthy();

    // login with new password
    const { req: r4, res: s4 } = createMockReqRes('POST', { email, password: newPassword }, undefined, { 'user-agent': 'jest' });
    // @ts-ignore
    const login2 = await loginHandler(r4, s4);
    const login2Resp = login2.payload || login2;
    expect(login2Resp.session).toBeDefined();
  });
});
