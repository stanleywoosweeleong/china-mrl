"""Prepare the app for GitHub Pages configured to publish main / (root)."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
html = (root / 'dist/index.html').read_text()
assert '<head>' in html
(root / 'index.html').write_text(html.replace('<head>', '<head><base href="./dist/">', 1))
(root / '.nojekyll').touch()
print('Prepared root index.html; application assets resolve under dist/.')
