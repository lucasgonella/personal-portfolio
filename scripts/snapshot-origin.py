"""Fetch only explicitly owned portfolio files; no remote mutations."""
from pathlib import Path
import hashlib
import json
from ftp_common import connect

ROOT = Path(__file__).resolve().parents[1]
FILES = ('index.html', '404.html', 'robots.txt', 'sitemap.xml', 'favicon-gonella.svg')

if __name__ == '__main__':
    destination = ROOT / '.private' / 'origin-2026-11-13'
    destination.mkdir(parents=True, exist_ok=True)
    manifest = {}
    with connect('/public_html') as ftp:
        for name in FILES:
            target = destination / name
            if target.exists():
                raise SystemExit('Snapshot already exists; preserve original backup')
            with target.open('wb') as stream:
                ftp.retrbinary('RETR ' + name, stream.write)
            manifest[name] = hashlib.sha256(target.read_bytes()).hexdigest()
    (destination / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(json.dumps(manifest, indent=2))
