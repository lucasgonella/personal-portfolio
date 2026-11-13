"""Exercise inventory, release and rollback against a simulated shared FTP host."""
import contextlib
import io
import ftplib
import json
import pathlib
import posixpath
import tempfile
import unittest
from unittest.mock import patch
from scripts import ftp as publisher


class FakeFTP:
    def __init__(self, files, writes):
        self.files, self.writes, self.current = files, writes, '/'

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def path(self, name):
        return posixpath.normpath(posixpath.join(self.current, name))

    def pwd(self):
        return self.current

    def cwd(self, name):
        target = self.path(name)
        if target != '/' and not any(p.startswith(target.rstrip('/') + '/') for p in self.files):
            raise ftplib.error_perm('550 Missing directory')
        self.current = target

    def mlsd(self):
        prefix = self.current.rstrip('/') + '/'
        items = {}
        for path, data in self.files.items():
            if not path.startswith(prefix):
                continue
            relative = path[len(prefix):]
            name = relative.split('/')[0]
            items[name] = {'type': 'dir' if '/' in relative else 'file', 'size': str(len(data))}
        return list(items.items())

    def retrbinary(self, command, callback):
        path = self.path(command.removeprefix('RETR '))
        if path not in self.files:
            raise ftplib.error_perm('550 Missing file')
        callback(self.files[path])

    def storbinary(self, command, stream):
        path = self.path(command.removeprefix('STOR '))
        self.files[path] = stream.read()
        self.writes.append(path)

    def mkd(self, path):
        # Tests use existing directories; new files are sufficient here.
        raise AssertionError('Unexpected directory creation')


class ReleaseTests(unittest.TestCase):
    def setUp(self):
        output = contextlib.redirect_stdout(io.StringIO())
        output.__enter__()
        self.addCleanup(output.__exit__, None, None, None)
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = pathlib.Path(self.temp.name)
        self.state = self.root / '.deploy'
        self.state.mkdir()
        self.original = {
            'index.html': b'old PT',
            'gonella-portfolio-v1/en/index.html': b'old EN',
            'gonella-portfolio-v1/.htaccess': b'old scoped rules',
        }
        self.new = {path: data.replace(b'old', b'new') for path, data in self.original.items()}
        self.new['gonella-portfolio-v1/app-new.js'] = b'new public script'
        marker = {'namespace': publisher.NAMESPACE, 'repository': publisher.OWNER_REPO,
                  'site': 'https://gonella.com.br/', 'files': [
                      {'path': p, 'sha256': publisher.sha(d)} for p, d in self.original.items()]}
        self.original[publisher.OWNER_PATH] = json.dumps(marker).encode()
        self.new[publisher.OWNER_PATH] = b'new marker'
        self.files = {'/public_html/' + p: d for p, d in self.original.items()}
        self.files['/public_html/another-site/index.html'] = b'protected application'
        self.files['/public_html/.htaccess'] = b'protected global rules'
        self.writes = []
        payload = {'namespace': publisher.NAMESPACE, 'files': [
            {'path': p, 'sha256': publisher.sha(d), 'bytes': len(d)} for p, d in self.new.items()]}
        (self.state / 'manifest.json').write_text(json.dumps(payload), encoding='utf-8')
        for path, data in self.new.items():
            target = self.root / 'dist' / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        for mock in (
            patch.object(publisher, 'ROOT', self.root), patch.object(publisher, 'STATE', self.state),
            patch.object(publisher, 'connect', side_effect=lambda: FakeFTP(self.files, self.writes)),
            patch.object(publisher, 'http_snapshot', side_effect=lambda url: {'url': url, 'status': 200}),
        ):
            mock.start()
            self.addCleanup(mock.stop)

    def test_full_release_and_rollback_preserve_shared_host_and_restore_both_languages(self):
        publisher.inventory()
        self.assertEqual(self.writes, [])
        publisher.deploy()
        self.assertEqual(self.writes[-1], '/public_html/index.html')
        publisher.verify()
        publisher.rollback()
        for path, data in self.original.items():
            self.assertEqual(self.files['/public_html/' + path], data)
        self.assertEqual(self.files['/public_html/another-site/index.html'], b'protected application')
        self.assertEqual(self.files['/public_html/.htaccess'], b'protected global rules')
        self.assertTrue(all(p == '/public_html/index.html' or p.startswith('/public_html/gonella-portfolio-v1/') for p in self.writes))
        self.assertIn('/public_html/gonella-portfolio-v1/app-new.js', self.files)

    def test_concurrent_remote_change_blocks_release_before_any_write(self):
        publisher.inventory()
        self.files['/public_html/gonella-portfolio-v1/en/index.html'] = b'another agent changed EN'
        with self.assertRaisesRegex(RuntimeError, 'changed after inventory'):
            publisher.deploy()
        self.assertEqual(self.writes, [])

    def test_corrupt_backup_blocks_release_and_rollback_before_any_write(self):
        publisher.inventory()
        (self.state / 'backup/targets/gonella-portfolio-v1/en/index.html').write_bytes(b'corrupt')
        with self.assertRaisesRegex(RuntimeError, 'backup is missing or corrupt'):
            publisher.deploy()
        with self.assertRaisesRegex(RuntimeError, 'backup checksum mismatch'):
            publisher.rollback()
        self.assertEqual(self.writes, [])

    def test_repeated_inventory_keeps_previous_backup(self):
        publisher.inventory()
        publisher.inventory()
        archived = list((self.state / 'releases').glob('*/backup/targets/gonella-portfolio-v1/en/index.html'))
        self.assertEqual(len(archived), 1)
        self.assertEqual(archived[0].read_bytes(), b'old EN')

    def test_protocol_command_injection_and_normalized_paths_are_rejected(self):
        for path in ['index.html\r\nDELE anything', 'gonella-portfolio-v1//app.js',
                     './index.html', 'gonella-portfolio-v1/.secrets/data.json']:
            self.assertFalse(publisher.allowed(path))


class TransportAuthorizationTests(unittest.TestCase):
    def test_unsupported_tls_never_transmits_credentials_without_explicit_authorization(self):
        from unittest.mock import MagicMock
        connection = MagicMock()
        connection.auth.side_effect = ftplib.error_perm('500 AUTH unsupported')
        credentials = {'LOCAWEB_FTP_HOST': 'example.test', 'LOCAWEB_FTP_USER': 'test', 'LOCAWEB_FTP_PASSWORD': 'test'}
        with patch.object(publisher, 'credentials', return_value=credentials), \
             patch.object(publisher.ftplib, 'FTP_TLS', return_value=connection), \
             patch.object(publisher.ftplib, 'FTP') as plaintext, \
             patch.dict(publisher.os.environ, {}, clear=True):
            with self.assertRaisesRegex(RuntimeError, 'explicit authorization'):
                publisher.connect()
            connection.login.assert_not_called()
            plaintext.assert_not_called()


if __name__ == '__main__':
    unittest.main()
