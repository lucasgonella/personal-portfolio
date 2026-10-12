"""Install a checksum-verified portable Node LTS into ignored workspace tooling."""
import hashlib
import io
import json
import pathlib
import urllib.request
import zipfile

root = pathlib.Path(__file__).resolve().parents[1]
versions = json.load(urllib.request.urlopen('https://nodejs.org/dist/index.json'))
version = next(v['version'] for v in versions if v['lts'])
filename = f'node-{version}-win-x64.zip'
base = f'https://nodejs.org/dist/{version}/'
checksums = urllib.request.urlopen(base + 'SHASUMS256.txt').read().decode()
expected = next(line.split()[0] for line in checksums.splitlines() if line.split()[-1] == filename)
data = urllib.request.urlopen(base + filename).read()
assert hashlib.sha256(data).hexdigest() == expected, 'Node checksum mismatch'
destination = root / '.tools'
destination.mkdir(exist_ok=True)
zipfile.ZipFile(io.BytesIO(data)).extractall(destination)
print(f'Installed verified Node LTS {version} in .tools/{filename[:-4]}')
