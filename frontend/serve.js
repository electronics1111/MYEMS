// ─── Simple local dev server ───
// Serves dist/wedding-hall-management.html on http://localhost:5000
// Useful when you want to test against the local backend (not file://)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;
const HTML_PATH = path.join(__dirname, "dist", "wedding-hall-management.html");

http.createServer((req, res) => {
  if (!fs.existsSync(HTML_PATH)) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    return res.end("Build first:  npm run build");
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  fs.createReadStream(HTML_PATH).pipe(res);
}).listen(PORT, () => {
  console.log(`✓ Frontend running on http://localhost:${PORT}`);
});
