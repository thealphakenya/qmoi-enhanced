import MpesaAdapter from './adapter';

jest.mock('node-fetch', () => jest.fn());
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

describe('MpesaAdapter - extended methods', () => {
  const cfg = { consumerKey: 'ck', consumerSecret: 'cs', passkey: 'pk', shortcode: '12345', env: 'sandbox' } as any;

  beforeEach(() => {
    (fetch as unknown as jest.Mock).mockReset();
  });

  it('performs b2cPayment successfully', async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ ConversationID: 'conv123' }), { status: 200 })));
    const ad = new MpesaAdapter(cfg);
    const res = await ad.b2cPayment('+254700000000', 100);
    expect(res.ConversationID).toBe('conv123');
  });

  it('performs requeryTransaction successfully', async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ Result: 'OK' }), { status: 200 })));
    const ad = new MpesaAdapter(cfg);
    const res = await ad.requeryTransaction('TX123');
    expect(res.Result).toBe('OK');
  });

  it('performs reversal successfully', async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ ResponseCode: '0' }), { status: 200 })));
    const ad = new MpesaAdapter(cfg);
    const res = await ad.reversal('TX123', 50);
    expect(res.ResponseCode).toBe('0');
  });
});
