// Minimal Express server for QMOI AI Main App
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from a 'public' directory if it exists
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('<h1>QMOI AI Main App is running!</h1><p>Welcome to QMOI AI. Add your UI here.</p>');
});

app.listen(PORT, () => {
  console.log(`QMOI AI Main App server running at http://localhost:${PORT}`);
});
