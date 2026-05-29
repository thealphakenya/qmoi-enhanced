import registerHandler from '../../pages/api/auth/register';
import loginHandler from '../../pages/api/auth/login';
import sessionHandler from '../../pages/api/auth/session';
import meHandler from '../../pages/api/auth/me';
import hasAccessHandler from '../../pages/api/auth/hasAccess';
import changeEmailHandler from '../../pages/api/auth/change-email';

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

describe('Auth integration (me / hasAccess / change-email)', () => {
  test('full flow', async () => {
    const username = `integ_${Date.now()}`;
    const email = `${username}@example.org`;
    const password = 'StrongPass123!';

    // register
    const { req: r1, res: s1 } = createMockReqRes('POST', { username, email, password });
    // @ts-ignore
    const reg = await registerHandler(r1, s1);
    const regResp = reg.payload || reg;
    expect(regResp).toBeDefined();

    // login
    const { req: r2, res: s2 } = createMockReqRes('POST', { email, password }, undefined, { 'user-agent': 'jest' });
    // @ts-ignore
    const login = await loginHandler(r2, s2);
    const loginResp = login.payload || login;
    expect(loginResp.session).toBeDefined();
    const session = loginResp.session;

    // me
    const { req: r3, res: s3 } = createMockReqRes('GET', undefined, { token: session.id });
    // @ts-ignore
    const me = await meHandler(r3, s3);
    const meResp = me.payload || me;
    expect(meResp.user).toBeDefined();
    expect(meResp.user.email).toBe(email);

    // hasAccess (feature that is likely master-only)
    const { req: r4, res: s4 } = createMockReqRes('POST', { token: session.id, feature: 'trading' });
    // @ts-ignore
    const has = await hasAccessHandler(r4, s4);
    const hasResp = has.payload || has;
    expect(typeof hasResp.allowed).toBe('boolean');

    // change email
    const newEmail = `${username}+chg@example.org`;
    const { req: r5, res: s5 } = createMockReqRes('POST', { token: session.id, newEmail });
    // @ts-ignore
    const ch = await changeEmailHandler(r5, s5);
    const chResp = ch.payload || ch;
    expect(chResp.user.email).toBe(newEmail);

    // verify me now returns new email
    const { req: r6, res: s6 } = createMockReqRes('GET', undefined, { token: session.id });
    // @ts-ignore
    const me2 = await meHandler(r6, s6);
    const me2Resp = me2.payload || me2;
    expect(me2Resp.user.email).toBe(newEmail);
  });
});
