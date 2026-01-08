/* eslint-disable @typescript-eslint/no-explicit-any */
// Minimal augmentation to ensure `status`, `json`, and `end` are available on NextApiResponse
// This avoids regressions caused by earlier lightweight augmentations.
declare module "next" {
  interface NextApiResponse<T = any> {
    status(code: number): NextApiResponse<T>;
    json(body: any): NextApiResponse<T>;
    end(body?: any): void;
    /** Legacy alias used throughout the codebase for backward compatibility */
    _response?: { status?: number; body?: any } | any;
  }

  interface NextApiRequest {
    /** Legacy convenience: parsed query parameters from middleware or routers */
    _query?: Record<string, any>;
    /** Legacy convenience: parsed body */
    _body?: any;
  }
}
