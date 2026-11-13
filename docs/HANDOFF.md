# Handoff — Codex / Claude Code

## Missão 02 — publicada e validada em 2026-11-13

Site: https://gonella.com.br/ e https://gonella.com.br/gonella-portfolio-v1/en/. GitHub: https://github.com/lucasgonella/personal-portfolio, branch remota `main` atualizada por push normal, incluindo os commits do bootstrap antes locais. Branch de trabalho: `codex/bootstrap-and-portfolio-improvements`.

- Implementação: `b1ebabc0314d5e258487f9622892ec0b48b2d39c`.
- **Fonte final da aplicação publicada:** `940de9c0746f3b9ebc6d4c0b310b0a8cefc1750a`, alinhando metadados Platform PT/EN.
- CI dessas duas revisões aprovado: [implementação](https://github.com/lucasgonella/personal-portfolio/actions/runs/43439525726) e [revisão publicada](https://github.com/lucasgonella/personal-portfolio/actions/runs/43440456628). Deploy foi feito localmente por FTP autorizado; o CI automático só validou.
- Um commit documental posterior registra o relatório final, sem alterar JS/CSS/HTML publicados.

### Alterações e evidências

Headline direta de infraestrutura, automação e confiabilidade; perfil e experiência antes dos laboratórios; especializações contextualizadas; direção DevOps/SRE/Platform distinta do cargo atual. Projetos priorizam competências transferíveis, exibem classificação, decisão e fonte pública, com validação/limites nos detalhes. Perfil profissional usa fatos fornecidos pelo proprietário; projetos pessoais não representam experiência em clientes.

Hero permite selecionar quatro camadas, com equivalência SVG/WebGL. Explorer tem oito nós, incluindo segurança, e reset de câmera. App compõe seções em `src/components/`; evidências em `src/engineering.ts`; motion opcional em `src/usePortfolioMotion.ts`. Foram removidas 18 regras CSS obsoletas, sem biblioteca nova. Preservados identidade, stack, URLs, contato, pré-renderização e funcionalidades anteriores.

Typecheck, lint e build aprovados; **10 testes operacionais**, **34 testes de navegador locais e 34 em produção**, zero falhas/skips. Axe automatizado sem violações PT/EN; console e requisições sem erros nas capturas de inspeção. Cobertura inclui teclado, 320/768/1024/1440 px, sem JS/WebGL, perda de contexto, movimento reduzido, carregamento adiado, seleção e reset. A suite também passou em Linux no GitHub Actions.

Lighthouse: performance **99 PT mobile / 100 desktop / 99 EN mobile**; demais categorias **100**. A primeira execução PT mobile foi 98, e a repetição final 99; JS/CSS não mudaram entre elas. CLS PT móvel ~0,000146, antes ~0,00827. Transferência JavaScript móvel observada caiu de 133.286 para 89.394 bytes (~33%). LCP PT observado ~2,01s; são dados de laboratório, sem INP/CrUX de campo. Resumo em [reports/mission02-validation.json](reports/mission02-validation.json), diagnóstico/antes-depois em [audit-mission02.md](audit-mission02.md).

### Publicação e preservação

Lucas confirmou explicitamente FTP convencional na porta 21 para este escopo e com backup. Scripts de deploy e reconhecimento agora exigem `LOCAWEB_ALLOW_PLAINTEXT_FTP=1` no ambiente antes do login sem TLS; workflow manual tem opt-in desmarcado por padrão. Uma credencial ou nota histórica não substitui a autorização atual.

Primeiro envio: seis arquivos. Correção de metadados: dois (HTML PT e manifesto). Índice principal por último, zero exclusões. **16 artefatos conferidos por hash FTP e 15 arquivos públicos por HTTPS**, sem falhas. `img/` e duas aplicações irmãs somam nove arquivos, idênticos por hash ao primeiro inventário. `.env` original preservado byte a byte, não versionado/publicado; `.htaccess` da raiz preservado. Nenhum rollback real foi necessário.

Estado atual de backup em `.deploy/backup/targets/`; inventário/manifesto/uploads/verificação em `.deploy/`. Backups anteriores, inclusive pré-missão, estão em `.deploy/releases/`. O rollback padrão volta ao estado anterior à última publicação; para voltar à revisão anterior à missão 02, revisar o archive apropriado. Não apagar ou sobrescrever evidências. Arquivos privados e relatórios completos são ignorados no Git.

### Memória e pendências

**13 páginas duráveis** em `default / gonella-site-pessoal`, com escritas MCP explícitas e controle de versão. Decisão da missão: `decisions/missao02-posicionamento-e-jornada.md`; problema de encoding: `gotchas/powershell-unicode.md`. Regras e procedimentos atualizados; índice em `working/estado-atual.md`.

1. Persistem **13 eventos históricos pré-marker e a linha da sessão** no fallback `default / gonella.com.br`; migração exige administrador do mesmo servidor, após encerrar esta sessão. Dry-run anterior foi negado com 403; não houve mudança de permissões. Ver `ai-memory.md`.
2. Configuração Claude existe, mas sessão real Claude ainda não foi validada. Não declarar essa integração testada.
3. Auditoria atual: runtime sem vulnerabilidades; **11 moderadas no tooling de lint**. Tratar em tarefa específica, sem force fix/downgrade automático.
4. Ao retomar, ler instruções, handoff, memória e Git real. Não recomeçar o site, nem repetir deploy sem novo build, testes, inventário e backup.

### Falhas observadas e corrigidas

Uma substituição temporária via pipeline PowerShell/Python perdeu acentos: `$OutputEncoding` era ASCII. A inspeção direta encontrou metadados Platform incompletos em PT; corrigidos com `apply_patch` e assertions de título/description nos dois idiomas. Não houve alteração global de encoding. O teste de ativação 3D foi ajustado para também funcionar em máquinas com menos núcleos, sem presumir autoativação de desktop.

---

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
