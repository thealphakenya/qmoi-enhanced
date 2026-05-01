// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability


const port = process.env.PORT || 3005;
const host = process.env.HOST || "0.0.0.0";

const indexPath = path.join(process.cwd(), "public", "index.html");

const server = http.createServer((_req, _res) => {
  if (_req.url === "/" || _req.url === "/index.html") {
    fs.readFile(indexPath, "utf8", (_err, data) => {
      if (_err) {
        _res.writeHead(500, { "Content-Type": "text/plain" });
        return _res.end("Failed to read index file");
      }
      _res.writeHead(200, { "Content-Type": "text/html" });
      _res.end(data);
    });
    return;
  }
  _res.writeHead(404, { "Content-Type": "text/plain" });
  _res.end("Not Found");
});

server.listen(port, host, () => {
  logger.info(`Static server running at https://${host}:${port}/`);
});

export default server;
