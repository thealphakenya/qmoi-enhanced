import { NextResponse } from 'next/server';

export function setCookie(response: NextResponse, name: string, value: string, options?: any) {
  // Use any to avoid strict NextResponse cookie signature differences across versions
  try {
    (response.cookies as any).set(name, value, options);
  } catch (e) {
    // fallback: set header directly
    const cookieStr = `${name}=${value}; Path=${options?.path || '/'}${options?.maxAge ? `; Max-Age=${options.maxAge}` : ''}${options?.httpOnly ? '; HttpOnly' : ''}${options?.secure ? '; Secure' : ''}`;
    response.headers.set('Set-Cookie', cookieStr);
  }
}

export function deleteCookie(response: NextResponse, name: string, options?: any) {
  try {
    (response.cookies as any).delete(name, options);
  } catch (e) {
    // fallback: expire cookie via header
    const cookieStr = `${name}=; Path=${options?.path || '/'}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    response.headers.set('Set-Cookie', cookieStr);
  }
}

export default { setCookie, deleteCookie };
