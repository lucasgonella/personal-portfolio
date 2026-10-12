# Publicação FTP restrita e rollback

## Escopo

Destino confirmado: FTP **porta 21**, raiz `/public_html`, correspondente ao document root solicitado. O primeiro inventário encontrou `index.html`, `img/` e `estudos/`. Não havia `.htaccess` listado. Não foi criado nem alterado `.htaccess`.

Allowlist fechada na raiz: `index.html`, `favicon-gonella.svg`, `robots.txt`, `sitemap.xml`, `404.html`. Só `index.html` tem substituição inicial explicitamente autorizada. Qualquer outro nome existente bloqueia a publicação, a menos que pertença ao manifesto de uma versão anterior verificada.

Subdiretório exclusivo: `gonella-portfolio-v1/`. Assets versionados, WOFF2, arte Open Graph, página inglesa, marcador `ownership.json` e configuração Apache própria `.htaccess`. Compressão e cache só se aplicam dentro desse diretório do portfólio, sem regras globais. Não usa `assets/` ou `img/` preexistentes. Caminhos absolutos, traversal, `/estudos`, `.htaccess` da raiz e extensões fora da allowlist são rejeitados.

## Procedimento local

```sh
python scripts/ftp.py inventory
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
python scripts/ftp.py deploy
python scripts/ftp.py verify
python scripts/verify-http.py
```

1. `inventory` usa credenciais locais somente em memória, confirma `/public_html`, lista a raiz e faz hash de todos os arquivos das árvores protegidas. Copia para `.deploy/backup/` os arquivos de raiz candidatos à substituição e preserva `.htaccess` integralmente se existir. Nenhuma escrita remota.
2. Nas próximas versões, o marcador remoto precisa corresponder ao site, ao repositório e ao namespace. Não basta o diretório existir. Backups são locais; as outras aplicações não são copiadas para área pública.
3. O build gera `.deploy/manifest.json` com caminho, bytes e SHA-256 de cada arquivo. Todo arquivo passa pela allowlist. Build não aceita arquivos desconhecidos.
4. O deploy confirma os checksums do inventário e a propriedade dos destinos existentes. Faz até três tentativas por arquivo, usa `STOR` binário, releitura e comparação SHA-256. Assets são enviados primeiro; `index.html` é o último arquivo.
5. `verify` compara todas as árvores protegidas e arquivos de raiz não controlados com o inventário, além dos checksums do build. `verify-http.py` confirma HTTPS, HTML PT/EN, assets, dados estruturados, canonical e comportamento HTTP de `/estudos/`.

Estado local, ignorado pelo Git:

```text
.deploy/inventory.json
.deploy/backup/
.deploy/manifest.json
.deploy/uploaded.json
.deploy/owned.json
.deploy/verification.json
artifacts/production-http.json
```

Guarde esse diretório de estado em local privado antes de iniciar outro inventário. Backups e inventários não são publicados no servidor. Logs não contêm valores de credenciais.

## Rollback

```sh
python scripts/ftp.py rollback
```

O comando valida o SHA-256 dos backups contra o inventário, restaura somente arquivos controlados da raiz que já existiam, restaura o marcador anterior se disponível e transfere o índice por último. Cada transferência é relida e verificada. Não remove arquivos nem diretórios. Assets com hash permanecem para que o HTML anterior continue funcional. Arquivos novos da raiz que não existiam antes ficam inertes; nenhum arquivo desconhecido é eliminado.

O inventário original e o backup anterior à primeira publicação continuam locais. Um teste isolado com FTP simulado valida o conteúdo restaurado e a ordem. Não se realiza rollback em produção sem regressão observada.

## GitHub Actions

Workflow `.github/workflows/portfolio.yml`, com actions fixadas em SHAs verificados. Pushes e PRs fazem lint, typecheck, testes da allowlist, build e testes de navegador. `workflow_dispatch` em `main` permite publicação manual e atualização opcional dos metadados GitHub. Execuções concorrentes são serializadas.

Secrets: `LOCAWEB_FTP_HOST`, `LOCAWEB_FTP_USER`, `LOCAWEB_FTP_PASSWORD`, `LOCAWEB_FTP_PORT`. A porta precisa ser `21`; o script recusa outros valores. O fluxo nunca recebe `.secrets/ftp.env`.

Cada publicação repete inventário, backup, upload restrito, verificação FTP, HTTPS e testes de navegador. Falha após publicação dispara rollback dos arquivos controlados. Artefatos de build, testes e rollback têm retenção de 30 dias. Artefatos do GitHub seguem a visibilidade/permissões do repositório; não são uma área de armazenamento de segredos.

## Limites de operação

FTP não é criptografado, conforme solicitado explicitamente. Não tenta outro protocolo. Locaweb não precisa de Node em runtime. Configurações Apache e páginas de outras aplicações são preservadas; configurar `ErrorDocument` global não faz parte deste deploy. INP de campo depende de tráfego real; os relatórios de laboratório não o substituem.
