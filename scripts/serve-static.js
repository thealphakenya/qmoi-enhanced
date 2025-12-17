import http from "http";
import fs from "fs";
import path from "path";

const port = process.env.PORT || 3005;
const host = process.env.HOST || "0.0.0.0";

const indexPath = path.join(process.cwd(), "public", "index.html");

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    fs.readFile(indexPath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Failed to read index file");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(port, host, () => {
  console.log(`Static server running at http://${host}:${port}/`);
});

export default server;
