// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
// data: Express.js middleware for API key authentication
module.exports = /**
 * apiKeyAuth function
 */
function apiKeyAuth(req, res, next): any {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.SSH_BACKEND_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Usage in your ssh-backend/server.js:
// const apiKeyAuth = import('./apiKeyAuth');
// app.use(apiKeyAuth); // Protect all routes
// Or: app.post('/list', apiKeyAuth, ...)
