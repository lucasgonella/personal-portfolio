# Deploy FTP seguro, backup e rollback

## Escopo comprovado em 2026-11-13

FTP porta 21, sessão inicia em `/`, document root `/public_html`. O caminho de sistema em `LOCAWEB_FTP_ROOT_FOLDER` não é acessível no FTP; o `.env` foi preservado. FTPS testado e rejeitado com `500 Command AUTH not understood`. FTP convencional está autorizado, com limitação de transporte registrada. Nunca tentar SFTP/SSH ou mudar configuração do servidor para contornar isso.

O marcador `gonella-portfolio-v1/ownership.json` identifica este site e `lucasgonella/personal-portfolio`. Raiz: somente `index.html`, `404.html`, `favicon-gonella.svg`, `robots.txt`, `sitemap.xml`, respeitando propriedade e hashes anteriores. Namespace exclusivo: `gonella-portfolio-v1/`, somente artefatos permitidos. `img/`, aplicações irmãs e todo caminho desconhecido são protegidos. Não modificar `.htaccess` da raiz. Não fazer mirror, remoção recursiva ou limpeza de assets antigos.

## Sequência obrigatória

1. Ler `AGENTS.md`, este documento e handoff; confirmar autorização atual, Git e manifesto.
2. Executar typecheck, lint, testes de segurança, build e testes de navegador PT/EN.
3. Fazer inventário somente leitura imediatamente antes da operação; validar marcador, caminhos, hashes e presença de aplicações protegidas. Guardar backup local privado de **cada arquivo que será substituído**, inclusive EN e marcador de propriedade, com hashes.
4. Confirmar ausência de alteração concorrente dos alvos desde o inventário. Recusar caminhos desconhecidos, traversal, symlinks ou manifesto inválido. Nunca publicar `.env`, instruções, memórias, backups ou `.git`.
5. Transferir artefatos do manifesto em modo binário/passivo, assets antes de HTML e `index.html` da raiz por último. Reler e verificar SHA-256. Não excluir nada.
6. Validar todos os hashes por FTP, status e conteúdo HTTPS de PT/EN, canonical, hreflang, assets, contato e navegação. Comparar evidências de preservação dos demais sites antes/depois.
7. Em regressão, restaurar do backup verificado todos os arquivos substituídos, com índice principal por último; confirmar FTP/HTTP. Assets novos podem permanecer inertes. Não apagar arquivos para rollback.

Scripts: `npm run deploy:inventory`, `npm run deploy`, `npm run deploy:verify`, `npm run rollback`, `python scripts/verify-http.py`. O build deve preceder o inventário. A publicação lê `.env` e o arquivo legado `.secrets/ftp.env`, com precedência das variáveis de ambiente. Tenta FTPS com certificado validado; recorre ao FTP autorizado somente se o servidor rejeitar a extensão com 500/502. Falha de certificado ou de autenticação não autoriza fallback.

**A partir da missão 02, o fallback também exige `LOCAWEB_ALLOW_PLAINTEXT_FTP=1` no ambiente do processo**, após autorização específica do proprietário. Sem isso, a operação encerra antes do login FTP. Não colocar o opt-in no `.env` nem interpretar credenciais como autorização. Lucas confirmou explicitamente o uso restrito de FTP convencional na missão 02. O workflow manual oferece `allow_plaintext_ftp`, desmarcado por padrão; precisa de escolha explícita. Scripts de reconhecimento compartilham a mesma conexão protegida.

O inventário copia todos os alvos existentes para `.deploy/backup/targets/<caminho>` e armazena os hashes em `inventory.json`. Repetir inventário arquiva o estado anterior em `.deploy/releases/<timestamp>/`. O deploy valida todos os backups antes da primeira escrita, trava o manifesto por hash e compara os arquivos remotos no preflight e imediatamente antes de cada transferência. Arquivos com hash idêntico são preservados sem transferência. O rollback restaura todos os alvos anteriores alterados, incluindo EN, configuração local do namespace e marcador, com índice principal por último. Backups são todos validados antes de iniciar a restauração.

## Estado privado e evidências

`.deploy/` contém inventário, backup, manifesto, uploads e verificação. Arquivar estado anterior em local privado antes de repetir inventário; não sobrescrever evidência de rollback pendente. Snapshot extra do reconhecimento em `.private/origin-2026-11-13/`. Credenciais são lidas somente em memória do `.env`/ambiente; não registrar valores nem conteúdo integral.

O workflow GitHub existente publica apenas por disparo manual; este trabalho não presume secrets, acesso ou execução de CI. Relatórios de outubro são históricos. Registrar resultado real atual em `HANDOFF.md`.
