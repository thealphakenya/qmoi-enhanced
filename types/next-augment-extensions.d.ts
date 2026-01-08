/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  NextApiRequest as OriginalNextApiRequest,
  NextApiResponse as OriginalNextApiResponse,
} from "next";

// Add commonly used Node/legacy properties used across the codebase
declare module "next" {
  interface NextApiRequest extends OriginalNextApiRequest {
    /** Commonly accessed headers map */
    headers?: Record<string, string | string[] | undefined>;
    /** Ensure body/method/query are available for handlers during triage */
    body?: any;
    method?: string | undefined;
    on?(event: "close", cb: () => void): void;
  }

  interface NextApiResponse<T = any> extends OriginalNextApiResponse<T> {
    // ServerResponse streaming helpers used in some endpoints
    write?(chunk: any, encoding?: string): boolean;
    writeHead?(statusCode: number, headers?: Record<string, string>): void;
    setHeader?(name: string, value: string | number | string[]): void;
    send?(body: any): void;
    // Keep existing convenience methods
    status?(code: number): NextApiResponse<T>;
    json?(body: any): NextApiResponse<T>;
    end?(body?: any): void;
  }
}
