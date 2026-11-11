"""Writes dist/share-qr.svg: the QR code for the app's public address, shown in the Share dialog.
Run after the address changes: python3 scripts/make_qr.py (needs the segno package)."""
from pathlib import Path
import segno

URL = 'https://stanleywoosweeleong.github.io/china-mrl/'
out = Path(__file__).resolve().parents[1] / 'dist' / 'share-qr.svg'
segno.make(URL, error='m').save(str(out), scale=10, border=4, dark='#111111', light='#ffffff', xmldecl=False, nl=False)
# A viewBox lets the image scale to whatever size the page gives it.
out.write_text(out.read_text().replace('width="410" height="410"', 'width="410" height="410" viewBox="0 0 410 410"', 1))
assert 'viewBox' in out.read_text()
print(out, out.stat().st_size, 'bytes')
