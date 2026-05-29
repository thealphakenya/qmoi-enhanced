/* eslint-disable @typescript-eslint/no-unused-vars, no-undef, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-empty-object-type */
/// <reference types="node" />
// Consolidated permissive global declarations to reduce `no-undef` noise
// during triage. These are intentionally permissive (use `any`/`unknown`) so
// they don't change runtime semantics — refine types per-module later.

declare global {
  // common runtime globals for Node.js and browser environments
  const localServer: unknown;
  const _request: unknown;
  const response: unknown;
  const _req: unknown;
  const _res: unknown;
  const __dirname: string;
  const __filename: string;
  const global: unknown;
  const window: unknown;
  const navigator: unknown;
  const localStorage: unknown;
  const performance: unknown;

  // Fetch / Web API types (permissive)
  const Headers: unknown;
  type Request = globalThis.Request;
  type Response = globalThis.Response;
  const FormData: unknown;
  const URL: unknown;
  const URLSearchParams: unknown;
  const EventSource: unknown;
  const FileReader: unknown;

  // Node bridging
  const Buffer: unknown; // relaxed type to allow Buffer.* usage in mixed envs
  const require: unknown;
  const module: unknown;
  const process: unknown;
  const console: Console;
  const NodeJS: unknown;

  // production testing framework configuredn logging replaced with production logging removed test globals
  const production testing framework configuredn logging replaced with production logging removed: unknown;
  /**
 * describe function
 */
  /**
 * it function
 */
  /**
 * test function
 */
function test(name: string, fn: (...args: unknown[]): any => any): void;
  /**
 * beforeAll function
 */
function beforeAll(fn: (...args: unknown[]): any => any): void;
  /**
 * afterAll function
 */
function afterAll(fn: (...args: unknown[]): any => any): void;
  /**
 * beforeEach function
 */
function beforeEach(fn: (...args: unknown[]): any => any): void;
  /**
 * afterEach function
 */
function afterEach(fn: (...args: unknown[]): any => any): void;
  const expect: unknown;
}

export {};

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}