// production implementation: this file has no remaining production markers
import { setupServer } from "msw/node";

// Create a server with no initial handlers. Handlers will be registered
// at test runtime to avoid ESM evaluation-order issues.
export const server = setupServer();
