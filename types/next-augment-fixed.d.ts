import type {
  NextApiRequest as OriginalNextApiRequest,
  NextApiResponse as OriginalNextApiResponse,
} from "next";

// Safe augmentation: extend existing Next types rather than overwrite them.
declare module "next" {
  interface NextApiRequest extends OriginalNextApiRequest {
    /** Legacy convenience: parsed query parameters from middleware or routers */
    _query?: Record<string, any>;
    /** Legacy convenience: parsed body */
    _body?: any;
  }

  interface NextApiResponse<T = any> extends OriginalNextApiResponse<T> {
    /** Legacy alias used throughout the codebase for backward compatibility */
    _response?: { status?: number; body?: any } | any;
  }
}
