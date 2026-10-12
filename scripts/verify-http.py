"""External HTTPS checks for the exact portfolio manifest. Never visits private endpoints."""
import concurrent.futures
import hashlib
import json
import os
import pathlib
import urllib.error
import urllib.request
from html.parser import HTMLParser

ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=os.environ.get('TEST_BASE_URL','https://gonella.com.br').rstrip('/')

def fetch(path):
    url=BASE+'/'+path
    response=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'GonellaPortfolioVerification/1.0','Cache-Control':'no-cache'}),timeout=45)
    content=response.read()
    return {'path':path,'status':response.status,'bytes':len(content),'sha256':hashlib.sha256(content).hexdigest(),'content_type':response.headers.get('Content-Type')},content

class References(HTMLParser):
    def __init__(self):
        super().__init__();self.assets=set();self.links=set();self.language=None;self.canonical=None;self.structured=False
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='html':self.language=attrs.get('lang')
        if tag=='script' and attrs.get('type')=='application/ld+json':self.structured=True
        if tag=='link' and attrs.get('rel')=='canonical':self.canonical=attrs.get('href')
        for key in ['href','src']:
            url=attrs.get(key,'')
            if tag=='a':self.links.add(url)
            elif url.startswith('/') and ('.' in url or key=='src'):self.assets.add(url[1:])

payload=json.loads((ROOT/'.deploy/manifest.json').read_text(encoding='utf-8'))
results=[];failures=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    futures={pool.submit(fetch,f['path']):f for f in payload['files']}
    for future,f in futures.items():
        # Apache protects configuration files from HTTP. Their exact bytes are verified over FTP.
        if f['path'].endswith('/.htaccess'):
            continue
        try:
            result,content=future.result()
            result['matches_build']=result['sha256']==f['sha256']
            if not result['matches_build']:failures.append(f['path']+' differs from checked build')
            if f['path'] in ['index.html','gonella-portfolio-v1/en/index.html']:
                parser=References();parser.feed(content.decode('utf-8'))
                result['html']={'lang':parser.language,'canonical':parser.canonical,'structured_data':parser.structured,'linked_assets':sorted(parser.assets),'github_links':sorted(l for l in parser.links if l.startswith('https://github.com/lucasgonella'))}
                manifest_paths={i['path'] for i in payload['files']}
                if not parser.assets.issubset(manifest_paths):failures.append('HTML contains asset outside build manifest')
                if not parser.structured:failures.append('Structured data missing')
            results.append(result)
        except Exception as error:failures.append(f['path']+' failed: '+type(error).__name__)
try:
    response=urllib.request.urlopen(BASE+'/estudos/',timeout=30)
    protected={'url':BASE+'/estudos/','status':response.status}
except urllib.error.HTTPError as error:protected={'url':BASE+'/estudos/','status':error.code}
before=json.loads((ROOT/'.deploy/inventory.json').read_text(encoding='utf-8'))
baseline=next(r for r in before['http_before'] if r['url'].endswith('/estudos/'))
protected['same_status_as_before']=protected['status']==baseline.get('status')
if not protected['same_status_as_before']:failures.append('Protected application changed HTTP status')
report={'base':BASE,'files':results,'protected_http':protected,'failures':failures,'ok':not failures}
(ROOT/'artifacts').mkdir(exist_ok=True)
(ROOT/'artifacts/production-http.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'verified_files':len(results),'protected_http':protected,'failures':failures,'ok':report['ok']},indent=2))
raise SystemExit(1 if failures else 0)
