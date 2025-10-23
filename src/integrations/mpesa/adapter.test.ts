import MpesaAdapter from './adapter';

// Mock fetch
jest.mock('node-fetch', () => jest.fn());
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

describe('MpesaAdapter', () => {
  const cfg = {
    consumerKey: 'key',
    consumerSecret: 'secret',
    passkey: 'passkey',
    shortcode: '123456',
    env: 'sandbox'
  };

  beforeEach(() => {
    (fetch as unknown as jest.Mock).mockReset();
  });

  it('retrieves token and sends stk push', async () => {
    // token response
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 })));
    // stkpush response
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ ResponseCode: '0', CheckoutRequestID: 'ABC123' }), { status: 200 })));

    const adapter = new MpesaAdapter(cfg as any);
    const token = await adapter.getToken();
    expect(token).toBe('tok');

    const res = await adapter.sendStkPush('+254700000000', 10);
    expect(res.ResponseCode).toBe('0');
  });
});
