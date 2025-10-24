/* eslint-env jest */
/* global jest, describe, it, expect, beforeEach */
import fetchWithRetry, { parseFetchResponse } from './fetchWithRetry';

jest.mock('node-fetch', () => jest.fn());
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

describe('fetchWithRetry helper', () => {
  beforeEach(() => {
    (fetch as unknown as jest.Mock).mockReset();
  });

  it('parses json response correctly', async () => {
    const body = { ok: true };
    const r = new Response(JSON.stringify(body), { status: 200 });
    const parsed = await parseFetchResponse(r as any);
    expect(parsed.ok).toBe(true);
    expect(parsed.data).toEqual(body);
  });

  it('retries on failure and returns error after attempts', async () => {
    (fetch as unknown as jest.Mock).mockImplementation(() => { throw new Error('fail'); });
    const res = await fetchWithRetry('https://example.com/test', {}, 2, 1);
    expect(res.ok).toBe(false);
    expect(typeof res.text).toBe('string');
  });
});
