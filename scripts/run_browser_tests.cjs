// Runs every browser check in sequence. Serves the repository at http://localhost:8089/china-mrl/ (as GitHub
// Pages does) for the scripts that expect it; test_pwa and test_auto_update start their own servers.
const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  { spawn } = require('child_process');
const root = path.resolve(__dirname, '..');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain'
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (!p.startsWith('/china-mrl/')) return res.writeHead(404), res.end();
  p = p.slice('/china-mrl'.length);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory())
    return res.writeHead(404), res.end();
  res.writeHead(200, {
    'content-type': types[path.extname(file)] || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  fs.createReadStream(file).pipe(res);
});
const scripts = [
  'test_standard_search',
  'test_access_catalogue',
  'test_layout',
  'test_language_switch',
  'test_accessibility',
  'test_pwa',
  'test_auto_update'
];
const run = (name) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(__dirname, name + '.cjs')], {
      stdio: 'inherit',
      env: process.env
    });
    const timer = setTimeout(() => child.kill('SIGKILL'), 300000);
    child.on('exit', (code) => (clearTimeout(timer), resolve(code === 0)));
  });
server.listen(8089, async () => {
  const failed = [];
  for (const name of scripts) {
    console.log(`\n▶ ${name}`);
    if (!(await run(name))) failed.push(name);
  }
  server.close();
  console.log(
    failed.length ? `\nFailed: ${failed.join(', ')}` : `\nAll ${scripts.length} browser checks passed.`
  );
  process.exitCode = failed.length ? 1 : 0;
});
