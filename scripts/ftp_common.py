"""Shared FTP connection and read-only origin inventory; credentials stay local."""
from ftplib import FTP_TLS, FTP, error_perm
from pathlib import Path
import json
import ssl

ROOT = Path(__file__).resolve().parents[1]

def config():
    values = {}
    for line in (ROOT / '.env').read_text(encoding='utf-8-sig').splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            key, value = line.split('=', 1)
            values[key.strip()] = value.strip().strip('\"\'')
    return values

def connect(remote=None):
    env = config()
    ftp = FTP_TLS(context=ssl.create_default_context(), timeout=25)
    ftp.connect(env['LOCAWEB_FTP_HOST'], int(env.get('LOCAWEB_FTP_PORT', 21)))
    try:
        ftp.auth()
    except error_perm as exc:
        if not str(exc).startswith(('500', '502')):
            raise
        ftp.close()
        # FTP is explicitly authorized; this host rejects the AUTH extension.
        ftp = FTP(timeout=25)
        ftp.connect(env['LOCAWEB_FTP_HOST'], int(env.get('LOCAWEB_FTP_PORT', 21)))
    ftp.login(env['LOCAWEB_FTP_USER'], env['LOCAWEB_FTP_PASSWORD'])
    if isinstance(ftp, FTP_TLS):
        ftp.prot_p()
    configured = remote if remote is not None else env['LOCAWEB_FTP_ROOT_FOLDER']
    try:
        ftp.cwd(configured)
    except error_perm:
        print('Configured folder unavailable:', configured)
        print('Login directory:', ftp.pwd())
        print('Read-only login inventory:', json.dumps(list(ftp.mlsd()), ensure_ascii=False))
        raise
    return ftp

if __name__ == '__main__':
    import sys
    try:
        with connect(sys.argv[1] if len(sys.argv) > 1 else None) as ftp:
            print('Transport:', 'FTPS' if isinstance(ftp, FTP_TLS) else 'FTP (AUTH unsupported)')
            print('Configured directory:', ftp.pwd())
            print(json.dumps(list(ftp.mlsd()), ensure_ascii=False, indent=2))
    except Exception as exc:
        message = str(exc)
        for key, value in config().items():
            if value and any(token in key for token in ('HOST', 'USER', 'PASSWORD')):
                message = message.replace(value, '<redacted>')
        print('Origin inspection failed:', type(exc).__name__, message)
        raise SystemExit(1)
