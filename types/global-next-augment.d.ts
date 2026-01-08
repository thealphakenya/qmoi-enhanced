/* eslint-disable @typescript-eslint/no-explicit-any */
// Global augment to ensure handlers can call .status/.json/.end on NextApiResponse
// This is a pragmatic triage to reduce type errors across many legacy handlers.
declare global {
  interface NextApiResponse<T = any> {
    status(code: number): NextApiResponse<T>;
    json(body: any): NextApiResponse<T>;
    end(body?: any): void;
    /** Legacy alias used throughout the codebase for backward compatibility */
    _response?: { status?: number; body?: any } | any;
  }

  interface NextApiRequest {
    /** HTTP method used */
    method?: string | undefined;
    /** Raw query (as present in Next requests) */
    query?: Record<string, any> | undefined;
    /** Raw body */
    body?: any;
    /** Legacy convenience: parsed query parameters from middleware or routers */
    _query?: Record<string, any>;
    /** Legacy convenience: parsed body */
    _body?: any;
  }
}

export {};
