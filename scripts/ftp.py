"""Conservative FTP/21 portfolio deploy. No remote deletion, no recursive writes.

Credentials are loaded only in memory. Local backups and inventories are ignored by Git.
"""
import argparse
import ftplib
import hashlib
import io
import json
import os
import pathlib
import time
import urllib.request
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parents[1]
STATE = ROOT / '.deploy'
NAMESPACE = 'gonella-portfolio-v1'
ROOT_ALLOWLIST = {'index.html', 'favicon-gonella.svg', 'robots.txt', 'sitemap.xml', '404.html'}
OWNER_PATH = NAMESPACE + '/ownership.json'
OWNER_REPO = 'lucasgonella/personal-portfolio'

def credentials():
    values = dict(os.environ)
    env = ROOT / '.secrets/ftp.env'
    if env.exists():
        for line in env.read_text(encoding='utf-8-sig').splitlines():
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                values[key.strip()] = value.strip().strip('\"\'')
    required = ['LOCAWEB_FTP_HOST', 'LOCAWEB_FTP_USER', 'LOCAWEB_FTP_PASSWORD', 'LOCAWEB_FTP_PORT']
    if any(not values.get(key) for key in required):
        raise RuntimeError('Missing required LOCAWEB_FTP_* configuration')
    if int(values['LOCAWEB_FTP_PORT']) != 21:
        raise RuntimeError('Only explicitly authorized FTP port 21 is supported')
    return values

def connect():
    c = credentials()
    ftp = ftplib.FTP(timeout=60)
    ftp.connect(c['LOCAWEB_FTP_HOST'], 21)
    ftp.login(c['LOCAWEB_FTP_USER'], c['LOCAWEB_FTP_PASSWORD'])
    ftp.set_pasv(True)
    return ftp

def entries(ftp):
    try:
        return [{'name': n, **f} for n, f in ftp.mlsd() if n not in ('.', '..')]
    except ftplib.error_perm:
        lines = []
        ftp.retrlines('LIST', lines.append)
        result = []
        for line in lines:
            parts = line.split(maxsplit=8)
            if len(parts) == 9 and parts[-1] not in ('.', '..'):
                result.append({'name': parts[-1], 'type': 'dir' if parts[0].startswith('d') else 'file', 'size': parts[4], 'listing': line})
        return result

def document_root(ftp):
    initial = ftp.pwd()
    if initial.rstrip('/').endswith('/public_html'):
        return initial
    listed = entries(ftp)
    if any(e['name'] == 'public_html' and e['type'] == 'dir' for e in listed):
        ftp.cwd('public_html')
        return ftp.pwd()
    # Do not infer a chroot from name alone. Require explicit evidence of the published root.
    for candidate in ('/public_html', '~/public_html'):
        try:
            ftp.cwd(candidate)
            return ftp.pwd()
        except ftplib.error_perm:
            ftp.cwd(initial)
    raise RuntimeError('Could not prove FTP document root public_html; no writes performed')

def read(ftp, path):
    result = io.BytesIO()
    ftp.retrbinary('RETR ' + path, result.write)
    return result.getvalue()

def sha(data):
    return hashlib.sha256(data).hexdigest()

def http_snapshot(url):
    try:
        response = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'GonellaPortfolioVerification/1.0'}), timeout=35)
        data = response.read()
        return {'url': url, 'status': response.status, 'final_url': response.url, 'sha256': sha(data), 'bytes': len(data)}
    except Exception as e:
        return {'url': url, 'error_type': type(e).__name__, 'status': getattr(e, 'code', None)}

def protected_tree(ftp, prefix=''):
    """Full hashes for estudos, listings for every other protected directory. Read-only."""
    result = []
    base = ftp.pwd()
    for item in entries(ftp):
        path = prefix + item['name']
        if item['type'] == 'dir':
            result.append({'path': path, 'type':'dir'})
            ftp.cwd(item['name'])
            result.extend(protected_tree(ftp, path + '/'))
            ftp.cwd(base)
        elif item['type'] == 'file':
            result.append({'path':path, 'type':'file', 'size':item.get('size'), 'sha256':sha(read(ftp,item['name']))})
    return result

def inventory():
    STATE.mkdir(exist_ok=True)
    with connect() as ftp:
        initial = ftp.pwd()
        root = document_root(ftp)
        listing = entries(ftp)
        report = {'date':datetime.now(timezone.utc).isoformat(), 'protocol':'FTP', 'port':21, 'initial_root':initial, 'document_root':root, 'root_entries':listing, 'protected':{}, 'root_hashes':{}, 'http_before': [http_snapshot('https://gonella.com.br/'),http_snapshot('https://gonella.com.br/estudos/')]}
        if any(e['name'] == NAMESPACE for e in listing):
            try:
                owner = json.loads(read(ftp, OWNER_PATH))
                if owner.get('repository') != OWNER_REPO or owner.get('site') != 'https://gonella.com.br/' or owner.get('namespace') != NAMESPACE:
                    raise RuntimeError('Namespace ownership marker is invalid')
                if not owner.get('files') or any(not allowed(f['path']) for f in owner['files']):
                    raise RuntimeError('Remote ownership marker contains paths outside the allowlist')
                (STATE/'owned.json').write_text(json.dumps(owner,indent=2),encoding='utf-8')
                report['ownership_verified'] = True
                (STATE/'backup').mkdir(exist_ok=True)
                (STATE/'backup/ownership.json').write_bytes(read(ftp, OWNER_PATH))
                try:
                    config=read(ftp,NAMESPACE+'/.htaccess')
                    (STATE/'backup/namespace-htaccess').write_bytes(config)
                    report['namespace_config_sha256']=sha(config)
                except ftplib.error_perm:
                    pass
            except (ftplib.error_perm, ValueError, KeyError):
                raise RuntimeError('Existing namespace ownership is unproved; inventory stopped without writes') from None
        backup = STATE / 'backup'
        backup.mkdir(exist_ok=True)
        for item in listing:
            name = item['name']
            if item['type'] == 'file':
                data = read(ftp,name)
                report['root_hashes'][name] = sha(data)
                if name in ROOT_ALLOWLIST or name == '.htaccess':
                    (backup / name).write_bytes(data)
            elif name != NAMESPACE:
                ftp.cwd(name)
                report['protected'][name] = protected_tree(ftp)
                ftp.cwd(root)
        (STATE/'inventory.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
        print(json.dumps({'document_root':root,'entries':[{'name':e['name'],'type':e['type']} for e in listing], 'backed_up':[p.name for p in backup.iterdir()], 'estudos_files_hashed':len(report['protected'].get('estudos',[])), 'http_before':report['http_before']},ensure_ascii=False,indent=2))

def allowed(path):
    p = pathlib.PurePosixPath(path)
    if p.is_absolute() or '..' in p.parts or '\\' in path:
        return False
    return path in ROOT_ALLOWLIST or path in {NAMESPACE + '/en/index.html', NAMESPACE + '/.htaccess'} or (len(p.parts) >= 2 and p.parts[0] == NAMESPACE and p.suffix in {'.js','.css','.svg','.webp','.avif','.png','.woff2','.json','.glb'})

def manifest():
    files = []
    for p in sorted((ROOT/'dist').rglob('*'),key=lambda p:p.relative_to(ROOT/'dist').as_posix()):
        if p.is_file():
            path = p.relative_to(ROOT/'dist').as_posix()
            if not allowed(path):
                raise RuntimeError('Build contains a destination outside the allowlist: ' + path)
            files.append({'path':path,'sha256':sha(p.read_bytes()),'bytes':p.stat().st_size})
    assert any(f['path']=='index.html' for f in files)
    STATE.mkdir(exist_ok=True)
    owner={'namespace':NAMESPACE,'repository':OWNER_REPO,'site':'https://gonella.com.br/','files':[f for f in files if f['path'] != OWNER_PATH]}
    marker=ROOT/'dist'/OWNER_PATH
    marker.parent.mkdir(parents=True,exist_ok=True)
    marker.write_text(json.dumps(owner,indent=2)+'\n',encoding='utf-8',newline='\n')
    files=[f for f in files if f['path'] != OWNER_PATH]
    files.append({'path':OWNER_PATH,'sha256':sha(marker.read_bytes()),'bytes':marker.stat().st_size})
    result={'namespace':NAMESPACE,'files':files}
    (STATE/'manifest.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps({'files':len(files),'bytes':sum(f['bytes'] for f in files),'manifest':'.deploy/manifest.json'}))

def transfer(path, data, root):
    for attempt in range(3):
        try:
            with connect() as ftp:
                assert document_root(ftp) == root
                current = root
                for part in pathlib.PurePosixPath(path).parts[:-1]:
                    current += '/' + part
                    try:
                        ftp.cwd(current)
                    except ftplib.error_perm:
                        ftp.mkd(current)
                        ftp.cwd(current)
                ftp.storbinary('STOR '+pathlib.PurePosixPath(path).name,io.BytesIO(data))
                if sha(read(ftp,pathlib.PurePosixPath(path).name)) != sha(data):
                    raise RuntimeError('Uploaded checksum mismatch')
            return
        except Exception:
            if attempt == 2:
                raise RuntimeError('Transfer failed after three attempts: ' + path) from None
            time.sleep(2 ** attempt)

def deploy():
    report=json.loads((STATE/'inventory.json').read_text(encoding='utf-8'))
    payload=json.loads((STATE/'manifest.json').read_text(encoding='utf-8'))
    root=report['document_root']
    owned_path=STATE/'owned.json'
    owned=json.loads(owned_path.read_text(encoding='utf-8')) if owned_path.exists() else {'files':[]}
    previous={f['path']:f['sha256'] for f in owned['files']} if report.get('ownership_verified') else {}
    with connect() as ftp:
        assert document_root(ftp)==root
        current={e['name']:e for e in entries(ftp)}
        # Only index is explicitly user-authorized for replacement. Preserve other unknown root files.
        for f in payload['files']:
            path=f['path']
            assert allowed(path)
            if '/' not in path and path in current:
                if path != 'index.html' and path not in previous:
                    raise RuntimeError('Existing root file ownership is unproved: '+path)
                if path in report['root_hashes'] and sha(read(ftp,path)) != report['root_hashes'][path]:
                    raise RuntimeError('Remote file changed after inventory: '+path)
        if NAMESPACE in current and not report.get('ownership_verified'):
            raise RuntimeError('Portfolio namespace already exists and ownership is unproved')
        if NAMESPACE in current:
            for f in payload['files']:
                path=f['path']
                if not path.startswith(NAMESPACE+'/') or path == OWNER_PATH:
                    continue
                try:
                    existing=read(ftp,path)
                except ftplib.error_perm:
                    continue
                if path not in previous or sha(existing) != previous[path]:
                    raise RuntimeError('Existing asset is unknown or changed since previous deploy: '+path)
    uploaded=[]
    for f in sorted(payload['files'],key=lambda f:(f['path']=='index.html',f['path'].endswith('.html'),'/' not in f['path'],f['path'])):
        data=(ROOT/'dist'/f['path']).read_bytes()
        assert sha(data)==f['sha256']
        transfer(f['path'],data,root)
        uploaded.append(f)
        (STATE/'uploaded.json').write_text(json.dumps(uploaded,indent=2),encoding='utf-8')
    (STATE/'owned.json').write_bytes((ROOT/'dist'/OWNER_PATH).read_bytes())
    print(json.dumps({'uploaded':len(uploaded),'index_last':uploaded[-1]['path']=='index.html','port':21,'deleted':0}))

def verify():
    before=json.loads((STATE/'inventory.json').read_text(encoding='utf-8'))
    payload=json.loads((STATE/'manifest.json').read_text(encoding='utf-8'))
    controlled_root={f['path'] for f in payload['files'] if '/' not in f['path']}
    result={'protected':{},'root_files':{},'portfolio':{},'http_after':[http_snapshot('https://gonella.com.br/'),http_snapshot('https://gonella.com.br/estudos/')], 'date':datetime.now(timezone.utc).isoformat()}
    with connect() as ftp:
        root=document_root(ftp)
        assert root==before['document_root']
        for name,original in before['protected'].items():
            ftp.cwd(name)
            current=sorted(protected_tree(ftp),key=lambda item:item['path'])
            original=sorted(original,key=lambda item:item['path'])
            original_by_path={item['path']:item for item in original}
            current_by_path={item['path']:item for item in current}
            modified_original=[path for path,item in original_by_path.items() if current_by_path.get(path)!=item]
            added=[path for path in current_by_path if path not in original_by_path]
            result['protected'][name]={'unchanged':current==original, 'entries':len(current), 'files':sum(item['type']=='file' for item in current), 'original_entries_preserved':not modified_original, 'modified_or_missing_original_entries':len(modified_original), 'added_entries':len(added), 'sha256_before':sha(json.dumps(original,sort_keys=True).encode()), 'sha256_after':sha(json.dumps(current,sort_keys=True).encode())}
            ftp.cwd(root)
        for name,checksum in before['root_hashes'].items():
            if name not in controlled_root:
                result['root_files'][name]={'unchanged':sha(read(ftp,name))==checksum}
        for f in payload['files']:
            result['portfolio'][f['path']]=sha(read(ftp,f['path']))==f['sha256']
    result['ok']=all(v['unchanged'] for v in result['protected'].values()) and all(v['unchanged'] for v in result['root_files'].values()) and all(result['portfolio'].values())
    (STATE/'verification.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))
    if not result['ok']:
        raise RuntimeError('Production verification failed')

def rollback():
    report=json.loads((STATE/'inventory.json').read_text(encoding='utf-8'))
    backup=STATE/'backup/index.html'
    if not backup.exists():
        raise RuntimeError('No previous index exists; use a reviewed maintenance index instead')
    assert sha(backup.read_bytes())==report['root_hashes']['index.html']
    payload=json.loads((STATE/'manifest.json').read_text(encoding='utf-8'))
    if (STATE/'backup/ownership.json').exists():
        if any(f['path']==NAMESPACE+'/.htaccess' for f in payload['files']):
            config_backup=STATE/'backup/namespace-htaccess'
            if report.get('namespace_config_sha256'):
                config=config_backup.read_bytes()
                assert sha(config)==report['namespace_config_sha256']
            else:
                config=b'# Portfolio overrides disabled after rollback.\n'
            transfer(NAMESPACE+'/.htaccess',config,report['document_root'])
        transfer(OWNER_PATH,(STATE/'backup/ownership.json').read_bytes(),report['document_root'])
    for f in sorted(payload['files'],key=lambda f:f['path']=='index.html'):
        path=f['path']
        original=STATE/'backup'/path
        if path in ROOT_ALLOWLIST and original.exists() and path in report['root_hashes']:
            data=original.read_bytes()
            assert sha(data)==report['root_hashes'][path]
            transfer(path,data,report['document_root'])
    print('Backed-up portfolio root files restored, index last; remote checksums verified. No assets or directories removed.')

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('action',choices=['inventory','manifest','deploy','verify','rollback'])
    args=parser.parse_args()
    try:
        globals()[args.action]()
    except Exception as e:
        # Never print network exception messages containing configuration or credentials.
        if isinstance(e,RuntimeError):
            print(str(e))
        else:
            print('Operation failed safely: '+type(e).__name__)
        raise SystemExit(1)
