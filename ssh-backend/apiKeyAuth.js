// Example: Express.js middleware for API key authentication
module.exports = function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.SSH_BACKEND_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Usage in your ssh-backend/server.js:
// const apiKeyAuth = require('./apiKeyAuth');
// app.use(apiKeyAuth); // Protect all routes
// Or: app.post('/list', apiKeyAuth, ...)
