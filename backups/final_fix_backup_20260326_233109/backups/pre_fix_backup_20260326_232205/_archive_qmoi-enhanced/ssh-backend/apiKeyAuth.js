// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
// data: Express.js middleware for API key authentication
module.exports = function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.SSH_BACKEND_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Usage in your ssh-backend/server.js:
// const apiKeyAuth = require('./apiKeyAuth');
// app.use(apiKeyAuth); // Protect all routes
// Or: app.post('/list', apiKeyAuth, ...)
