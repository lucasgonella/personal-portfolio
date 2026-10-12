import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

test('FTP allowlist rejects traversal, other apps, ambiguous root paths and build artifacts',()=>{
  const cases={ 'index.html':true, 'robots.txt':true, 'gonella-portfolio-v1/app-a1.js':true, 'gonella-portfolio-v1/.htaccess':true, 'gonella-portfolio-v1/en/index.html':true, 'gonella-portfolio-v1/img/demo.webp':true, 'estudos/index.html':false, 'img/logo.png':false, '.htaccess':false, '../index.html':false, '/index.html':false, 'gonella-portfolio-v1/../../estudos/index.html':false, 'gonella-portfolio-v1/secret.env':false, 'gonella-portfolio-v1/other.html':false, 'gonella-portfolio-v1\\file.js':false, 'assets/other.js':false }
  const script="import json; from scripts.ftp import allowed; cases=json.loads(input()); print(json.dumps({p:allowed(p) for p in cases}))"
  const result=JSON.parse(execFileSync('python',['-c',script],{input:JSON.stringify(cases),encoding:'utf8'}))
  assert.deepEqual(result,cases)
})

test('FTP rejects any port other than explicit conventional port 21',()=>{
  const script="from unittest.mock import patch; import os; from scripts.ftp import credentials; values={'LOCAWEB_FTP_HOST':'test','LOCAWEB_FTP_USER':'test','LOCAWEB_FTP_PASSWORD':'test','LOCAWEB_FTP_PORT':'22'}; caught=False\nwith patch('pathlib.Path.exists',return_value=False),patch.dict(os.environ,values,clear=True):\n try: credentials()\n except RuntimeError: caught=True\nassert caught\nprint('rejected')"
  assert.equal(execFileSync('python',['-c',script],{encoding:'utf8'}).trim(),'rejected')
})

test('No remote deletes or destructive synchronization exist in FTP publisher',()=>{
  const script="from pathlib import Path; import ast; t=ast.parse(Path('scripts/ftp.py').read_text()); forbidden={'delete','rmd','rename'}; assert not any(isinstance(n,ast.Call) and isinstance(n.func,ast.Attribute) and n.func.attr in forbidden for n in ast.walk(t)); print('safe')"
  assert.equal(execFileSync('python',['-c',script],{encoding:'utf8'}).trim(),'safe')
})

test('Rollback restores only controlled root files, verifies backup hashes and sends index last',()=>{
  const script=`import tempfile,json,pathlib
from unittest.mock import patch
import scripts.ftp as publisher
with tempfile.TemporaryDirectory() as temp:
 state=pathlib.Path(temp); (state/'backup').mkdir()
 original={'index.html':b'previous portfolio','robots.txt':b'previous robots','.htaccess':b'protected rules'}
 for name,data in original.items(): (state/'backup'/name).write_bytes(data)
 (state/'inventory.json').write_text(json.dumps({'document_root':'/public_html','root_hashes':{n:publisher.sha(d) for n,d in original.items()}}))
 (state/'manifest.json').write_text(json.dumps({'files':[{'path':'index.html'},{'path':'robots.txt'},{'path':'gonella-portfolio-v1/app.js'}]}))
 sent=[]
 with patch.object(publisher,'STATE',state),patch.object(publisher,'transfer',side_effect=lambda p,d,r:sent.append((p,d,r))): publisher.rollback()
 assert [i[0] for i in sent]==['robots.txt','index.html']
 assert sent[-1][1]==original['index.html']
 assert all(i[2]=='/public_html' for i in sent)
 print('rollback passed')`
  assert.match(execFileSync('python',['-c',script],{encoding:'utf8'}),/rollback passed/)
})
