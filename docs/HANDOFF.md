# Handoff — Codex / Claude Code

## Missão 02 — implementação pronta, release em preparação

Pedido atual: evolução premium do portfólio e atualização de `lucasgonella/personal-portfolio`. Diagnóstico em `audit-mission02.md`; nova decisão em `decisions/missao02-posicionamento-e-jornada.md` no ai-memory `default / gonella-site-pessoal`.

Implementado: headline direta, experiência antes de laboratórios, especializações contextualizadas, decisões e referências públicas visíveis nos projetos, direção Platform além de DevOps/SRE, interação de quatro camadas no hero, oitavo nó de segurança e reset de perspectiva. App compõe seções extraídas; motion é opcional por preferência/viewport/economia de dados. Sem bibliotecas novas. Conteúdo PT/EN e identidades dos projetos preservados.

Typecheck, lint e build passaram. Dez testes operacionais aprovados; suíte ampliada para 34 testes de navegador, incluindo novas interações e carregamento progressivo. Capturas desktop/mobile revisadas. Lighthouse local móvel mediu 99 em performance e 100 nas demais categorias; validação de produção desta missão ainda pendente.

Lucas confirmou explicitamente FTP convencional no escopo restrito e com backup. O publicador e os scripts de leitura exigem `LOCAWEB_ALLOW_PLAINTEXT_FTP=1` antes de qualquer login sem TLS. O workflow manual tem opt-in desmarcado por padrão. Não inferir autorização para outro deploy a partir do `.env`.

Próximo: confirmar testes finais, registrar revisão, atualizar GitHub sem force push, publicar manifesto após inventário/backup, validar FTP/HTTPS/34 testes e Lighthouse em produção. Não confundir os resultados históricos abaixo com o estado da release da missão 02. Pendências de migração de 13 eventos e sessão real Claude continuam registradas.

## Histórico da missão 01 — resultado em 2026-11-13

Portfólio atualizado e validado em **https://gonella.com.br/** e **https://gonella.com.br/gonella-portfolio-v1/en/**. Bootstrap, auditoria, implementação, testes, deploy FTP e validação concluídos. Há pendências administrativas da memória e de validação entre clientes descritas abaixo; não declarar isolamento retroativo completo.

O diretório iniciou somente com `.env`. Fonte original recuperada pelo marcador FTP de `lucasgonella/personal-portfolio`, preservando histórico original `5261cdf811f24ad0be50595cf74db988d9e2f85a`. Branch local: `codex/bootstrap-and-portfolio-improvements`.

- `c11d6c8c752140829b007912d5e51af0c7ea07b8`: instruções, memória, documentação/papéis, melhorias de conteúdo, UX, acessibilidade/movimento, SEO e publicação segura.
- `d40a701875ed1fb1f678dea2c8fcc44e332877e5`: **revisão de aplicação em produção**, corrigindo CLS móvel com detecção JS antes da pintura e teste de carregamento atrasado.
- A documentação final de evidências é registrada em commit posterior, sem alterar a aplicação. Não houve push, merge ou execução de GitHub Actions; commits e branch permanecem locais.

## Entregas e arquivos

Instruções: `AGENTS.md`, `CLAUDE.md`, `.ai-memory.toml`; referências dos cinco papéis em `agents/roles/`. Documentação: `architecture.md`, `design-system.md`, `deploy-ftp.md`, `decisions.md`, `ROADMAP.md`, `audit-2026-11.md`, `ai-memory.md` e este handoff. README e documento histórico de deploy apontam para o processo vigente.

Aplicação: `src/App.tsx`, `content.ts`, `projects.ts`, `data/projects.json`, `SceneHost.tsx`, `main.tsx`, `styles.css`, `index.html` e `scripts/prerender.mjs`. Cargo atual/objetivo DevOps-SRE separados, caminhos para evidências de projetos, snapshot público atualizado, escopo do laboratório atribuído ao README, metadados localizados, conteúdo/navegação sem JS, reduced-motion dinâmico e ativação 3D pausada quando apropriado. Stack, URLs e identidade visual preservadas.

Operação: `scripts/ftp.py`, testes Node/Python/Playwright, workflow de retenção de backups, `.gitignore`, `.gitattributes`, `.nvmrc` e scripts de reconhecimento somente leitura. Publicador lê `.env`, prefere FTPS, valida todos os backups e manifesto, detecta concorrência e restaura PT/EN no rollback. Nenhuma dependência adicionada/atualizada.

## Evidências de qualidade

- Typecheck, lint e build PT/EN aprovados com Node **24.22.3**, Python 3.13.14. Node 26 global falhou por entropia OpenSSL; portátil oficial em `.tools/node24/` validado por SHA-256 e ignorado, sem alteração global.
- Nove testes operacionais aprovados: quatro Node e cinco Python; host compartilhado simulado, concorrência, backup corrompido, archive, isolamento e restauração PT/EN.
- **24 testes Playwright/Edge locais e 24 em produção aprovados**, zero falhas/skips: idiomas, mobile 320 px, teclado, axe, sem JS/WebGL, perda de contexto, clipboard, movimento e header estável com módulo atrasado.
- Lighthouse final: performance **99 PT mobile / 100 desktop / 99 EN mobile**; acessibilidade, boas práticas e SEO **100** nas três medições. CLS móvel final ~0,008; os dados são de laboratório, sem alegação de INP/CrUX.
- Falhas observadas e corrigidas: precedência de camada CSS ocultando detalhes sem JS; CLS 0,065 na primeira publicação. Não reutilizar o relatório intermediário como resultado final.
- Resumo sanitizado: [reports/validation-2026-11.json](reports/validation-2026-11.json). Relatórios completos/capturas locais em `artifacts/`; resultados históricos de outubro continuam distintos.

## Deploy e preservação

FTP porta 21, document root comprovado `/public_html`. FTPS rejeitado pelo servidor com AUTH não suportado. Não presumir que o caminho de sistema em `.env` é caminho navegável no FTP.

Primeiro envio: seis arquivos. Correção: três (PT, EN e marcador). Índice principal sempre por último, zero exclusões. **16 artefatos conferidos por hash FTP**, **15 arquivos públicos verificados em HTTPS**, sem falhas; configuração Apache do namespace é verificada apenas por FTP.

`img/` (um arquivo), dashboard (cinco) e aplicação irmã (três) conferem por hashes com o primeiro inventário; nenhum outro site foi modificado. Nenhuma alteração no `.htaccess` da raiz. `/estudos/` era 404 antes e permanece 404; não criar esse caminho por conveniência. `.env` preservado byte a byte, não rastreado e não publicado.

Backups atuais: `.deploy/backup/targets/`. Inventário, manifesto, uploads e verificação: `.deploy/`. Estados anteriores e backup original: `.deploy/releases/`; snapshot extra: `.private/origin-2026-11-13/`. **Não sobrescrever/apagar esses estados antes de avaliar rollback.** O comando de rollback restaura o estado anterior ao último deploy; para voltar ao original de antes da missão, revisar o archive correspondente e seu manifesto. Nenhum rollback real foi necessário; a correção foi publicada pelo mesmo processo restrito.

## Memória e próximos passos

**Onze páginas duráveis** persistidas via MCP exclusivamente em `default / gonella-site-pessoal`; índice em `working/estado-atual.md`, lista em `ai-memory.md`. Atualizações com releitura e versão esperada. Hooks Codex realmente capturam os eventos atuais; Claude Code tem MCP e hooks configurados no mesmo endpoint. Instalação WSL preservada, com servidor distinto.

1. **Administrador do mesmo ai-memory, após esta sessão terminar:** revisar e migrar a sessão `01a1d4fb-7b44-7532-ba6a-26f709e97efc` e seus 13 eventos iniciais do fallback `default / gonella.com.br`. O marker não existia no início. Dry-run foi negado com HTTP 403 root-only; nada foi movido/apagado e nenhuma permissão foi alterada. Procedimento em `ai-memory.md`.
2. Validar uma nova sessão Codex e uma sessão real Claude Code iniciadas com o marker já presente. Não afirmar que Claude foi testado nesta tarefa.
3. Tratar 11 vulnerabilidades moderadas em ferramentas de lint em tarefa específica. Auditoria runtime retornou zero; não usar force fix/downgrade automático.
4. Quando houver nova mudança, ler instruções, este handoff, memória e Git real. Preservar a implementação; não recomeçar do zero. Não publicar novamente sem novo build, testes, inventário e backup.
