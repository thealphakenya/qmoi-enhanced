/* eslint-env jest */
/* global jest, describe, it, expect, beforeEach */
import MpesaAdapter from './adapter';

jest.mock('node-fetch', () => jest.fn());
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

describe('MpesaAdapter edge cases', () => {
  beforeEach(() => {
    (fetch as unknown as jest.Mock).mockReset();
  });

  it('getToken throws when fetch always fails', async () => {
    (fetch as unknown as jest.Mock).mockImplementation(() => Promise.reject(new Error('network')));
    const adapter = new MpesaAdapter({ consumerKey: 'a', consumerSecret: 'b', env: 'sandbox' });
    await expect(adapter.getToken()).rejects.toThrow(/Token request failed/);
  });

  it('sendStkPush retries on transient failure and then succeeds', async () => {
    // token success
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 })));
    // first STK attempt fails
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('transient')));
    // second STK attempt succeeds
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ ResponseCode: '0', CheckoutRequestID: 'ABC' }), { status: 200 })));

    const adapter = new MpesaAdapter({ consumerKey: 'a', consumerSecret: 'b', passkey: 'p', shortcode: '123', env: 'sandbox' });
    const res = await adapter.sendStkPush('+254700000000', 10);
    expect(res.ResponseCode).toBe('0');
    // at least 3 fetch calls: token + 2 stk attempts
    expect((fetch as unknown as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it('b2cPayment throws on non-ok response', async () => {
    // token success
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 })));
    // b2c returns 500
    (fetch as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ error: 'server' }), { status: 500 })));

    const adapter = new MpesaAdapter({ consumerKey: 'a', consumerSecret: 'b', shortcode: '123', env: 'sandbox' });
    await expect(adapter.b2cPayment('+254700000000', 100)).rejects.toThrow(/B2C failed/);
  });
});
