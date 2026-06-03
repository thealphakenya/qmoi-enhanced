import fetch from 'node-fetch';

const SERVER = process.env.QMOI_SERVER || 'http://localhost:3000';
const users = [
  {
    id: 'master',
    name: 'Victor',
    email: 'victor@kwemoi.com',
    password: 'Victor9798!',
    role: 'master',
  },
  {
    id: 'sister',
    name: 'Leah',
    email: 'leah@chebet.com',
    password: 'Ashlehael',
    role: 'sister',
  },
];

async function tryEndpoint(path, body) {
  const url = `${SERVER}${path}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) { json = text; }
    return { ok: res.ok, status: res.status, headers: Object.fromEntries(res.headers.entries()), body: json };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

(async function main() {
  console.log('Auth flow tester starting. Server:', SERVER);

  for (const u of users) {
    console.log('\n--- Testing user:', u.id);

    console.log('1) Attempting /api/auth/register');
    const reg = await tryEndpoint('/api/auth/register', { email: u.email, username: u.id, password: u.password, name: u.name, role: u.role });
    console.log('register =>', reg);

    console.log('2) Attempting /api/auth/signin');
    const sign = await tryEndpoint('/api/auth/signin', { email: u.email, password: u.password });
    console.log('signin =>', sign);

    console.log('3) Attempting password reset initiation /api/auth/reset-password');
    const reset = await tryEndpoint('/api/auth/reset-password', { email: u.email });
    console.log('reset =>', reset);

    console.log('4) Verifying alias endpoint /api/auth/forgot');
    const forgotAlias = await tryEndpoint('/api/auth/forgot', { email: u.email });
    console.log('forgot alias =>', forgotAlias);

    if (reset.body && reset.body.debugToken) {
      console.log('4) Confirming reset token with /api/auth/confirm-reset');
      const confirm = await tryEndpoint('/api/auth/confirm-reset', {
        token: reset.body.debugToken,
        newPassword: `${u.password}_new`,
      });
      console.log('confirm =>', confirm);
    }

    console.log('5) Attempting /api/auth/signin with userId');
    const sign2 = await tryEndpoint('/api/auth/signin', { userId: u.id, password: u.password });
    console.log('signin(userId) =>', sign2);
  }

  console.log('\nDone. Note: run the Next.js app (npm run dev) before executing this script.');
})();
