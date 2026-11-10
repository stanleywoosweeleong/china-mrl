// Fails when index.html, the manifests or the service workers are stale relative to dist/ and scripts/.
const { execSync } = require('child_process');
const files = 'index.html sw.js manifest.webmanifest dist/sw.js dist/manifest.webmanifest';
const before = execSync(`git hash-object ${files}`).toString();
execSync('python3 scripts/prepare_pages.py', { stdio: 'ignore' });
if (execSync(`git hash-object ${files}`).toString() !== before) {
  console.error('Generated files were stale. Run `python3 scripts/prepare_pages.py` and commit the result.');
  process.exit(1);
}
console.log('Generated files are current.');
