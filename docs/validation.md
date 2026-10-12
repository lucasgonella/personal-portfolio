# Evidências de validação

## Condições

Validações executadas em outubro de 2026, Windows, Node 24.21.0, Python 3.13.14 e Edge instalado. O Chromium baixado foi bloqueado pelo controle de aplicações do Windows; o navegador Edge foi usado realmente, não simulado. Testes de navegador via Playwright 1.64.0, viewport desktop 1440×1000 e perfil mobile iPhone 13 em engine Chromium/Edge.

Lighthouse 13.5.0: três páginas representativas. Mobile usa o preset de throttling simulado padrão do Lighthouse (rede e CPU); desktop usa RTT 40 ms, throughput 10.240 Kbps e CPU 1×. Relatórios JSON/HTML incluem configurações, data e user agent efetivos. Não representam SLA, tráfego real nem resultado uniforme em todos os dispositivos.

## Verificações locais executadas

- Lint e typecheck aprovados.
- Build estático PT/EN com prerenderização aprovado.
- 4 testes da publicação: allowlist e traversal; porta obrigatória 21; ausência de comandos de exclusão; rollback simulado com checksums e índice por último.
- 14 testes Playwright aprovados em produção, abrangendo PT/EN, navegação mobile, seleção da topologia, detalhes de projetos, timeline, contexto da stack, movimento reduzido, teclado, auditoria WCAG, WebGL explícito, pausa, perda de contexto, WebGL indisponível e conteúdo/layout sem JavaScript.
- Auditoria axe-core nos dois idiomas e nos dois perfis: zero violações WCAG A/AA encontradas.
- Revisão de screenshots desktop, mobile, hero, Explorer e showcases.

| Página local | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| PT mobile | 99 | 100 | 100 | 100 | 1,82 s | 0,00002 | 0 ms |
| EN mobile | 99 | 100 | 100 | 100 | 1,80 s | 0,00002 | 4 ms |
| PT desktop, após otimização | 92 | 100 | 100 | 100 | 0,41 s | 0,00008 | 236 ms |

A primeira medição desktop registrou 87 em performance e 304 ms TBT. Foi corrigido o bloqueio de shaders usando compilação assíncrona e adiando renders até a conclusão. O teste WebGL foi repetido após a alteração e aprovado nos dois perfis.

**INP não foi medido em campo.** TBT é uma métrica de laboratório diferente; não é tratado como INP. Os charts de projetos são simulações, sem métricas operacionais.

## Hospedagem antes da publicação

Inventário FTP/21 confirmou `/public_html`, com `index.html`, `img/` e `estudos/`. Backup do índice anterior mantido localmente em `.deploy/backup/index.html`. SHA-256 anterior: `e0cc2592f13c41104c879ccdc3f0de261f7ad4f39000a33ff8c42c57dd87fd76`.

`https://gonella.com.br/` retornava 200. `https://gonella.com.br/estudos/` retornava **403**. Portanto, manter 403 é preservar o comportamento anterior, não um novo erro introduzido pelo portfólio. Inventário e hashes completos das duas árvores protegidas estão em `.deploy/inventory.json` local, fora do Git.

## Produção publicada e validada

URL: **https://gonella.com.br/** · Inglês: **https://gonella.com.br/gonella-portfolio-v1/en/**

Repositório: [lucasgonella/personal-portfolio](https://github.com/lucasgonella/personal-portfolio). Commit do deploy: [`5f8dec086e81f8e06ed24734698faaa77ad79eac`](https://github.com/lucasgonella/personal-portfolio/commit/5f8dec086e81f8e06ed24734698faaa77ad79eac).

[Execução GitHub Actions com publicação FTP e validação externa aprovadas](https://github.com/lucasgonella/personal-portfolio/actions/runs/38197610060). Lint, typecheck, testes, build, inventário, backup, upload FTP/21 e testes de produção realmente executados. Quatro secrets cadastrados; nenhum arquivo de credenciais foi versionado.

### Lighthouse final em HTTPS

Medições em 12/10/2026, 10:39:57–10:40:22 UTC, navegador com perfil novo a cada cenário. Mobile: rede simulada com RTT 150 ms, 1.638,4 Kbps e CPU 4×; desktop: RTT 40 ms, 10.240 Kbps e CPU 1×. Configurações e ambiente completos no [JSON do relatório](reports/lighthouse-production.json).

| Página de produção | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| PT mobile | **99** | **100** | **100** | **100** | **1,81 s** | 0,00002 | 0 ms |
| PT desktop | **100** | **100** | **100** | **100** | **0,42 s** | 0,00005 | 0 ms |
| EN mobile | **100** | **100** | **100** | **100** | **1,52 s** | 0,00981 | 1 ms |

A primeira versão na hospedagem registrou 90/86/90 em performance e LCP mobile próximo a 2,9 s. A revisão final incorporou CSS crítico de 10,8 KiB, stylesheet completo sem bloquear a primeira pintura, preload antecipado da fonte, iluminação 3D por luzes sem geração de ambiente em runtime e compressão/cache apenas dentro do namespace do portfólio. Não houve configuração Apache global.

14 testes de navegador passaram também contra o domínio público, incluindo WebGL real e seus fallbacks. Auditorias axe nos dois idiomas e perfis não encontraram violações nos critérios WCAG testados. Os cinco links de repositórios, o perfil GitHub e a demo eleitoral retornaram HTTPS 200. LinkedIn é confirmado pelo perfil público; o serviço bloqueia leitura automatizada com 999.

16 arquivos ativos conferem por SHA-256 com o build. 15 recursos públicos foram verificados por HTTPS; o `.htaccess` exclusivo é protegido pelo Apache e foi conferido por FTP. Navegação, canonicals, metadados, dados estruturados, fontes, CSS, JavaScript, arte Open Graph e versões PT/EN estão disponíveis. Nenhum erro de JavaScript foi registrado nos testes funcionais.

### Arquivos publicados e preservação

Alterado na raiz: `index.html`. Criados na raiz: `favicon-gonella.svg`, `robots.txt`, `sitemap.xml`, `404.html`. Diretório exclusivo criado: `gonella-portfolio-v1/`, contendo assets com hash, WOFF2, Open Graph, página EN, marcador de propriedade e `.htaccess` próprio. Duas versões antigas de JavaScript permanecem inertes; não houve exclusão de assets. [Manifesto explícito com caminhos, bytes e hashes](reports/deployment-manifest.json).

Às 02:59 UTC, imediatamente após o deploy final, a pipeline confirmou **igualdade integral das árvores `estudos/` e `img/`**, com a mesma resposta HTTP 403 de `/estudos/`. Evidência retida no artefato de rollback dessa execução.

Uma verificação posterior, às 10:47 UTC, encontrou 15 entradas adicionais em `/estudos`, com horários de modificação informados pelo servidor em torno de 03:44 UTC, posteriores ao término do deploy. `/estudos/` passou a responder 200. **As duas entradas originais continuam presentes e seus hashes permanecem idênticos; nenhuma entrada original foi alterada ou removida.** `img/` continua integralmente idêntico. A lista de destinos das publicações não inclui nenhuma escrita nesses diretórios.

Isso distingue a proteção comprovada durante o deploy da atualização posterior de outra publicação. A identidade de quem acrescentou os arquivos não foi inferida. O verificador estrito continua sinalizando a diferença em relação ao inventário histórico; não foi enfraquecido para esconder alterações concorrentes. Nenhum rollback foi realizado, pois não há regressão causada pelo portfólio e os arquivos originais protegidos estão preservados. [Evidência sanitizada de preservação](reports/preservation.json).

Backups originais permanecem locais em `.deploy/releases/initial/`; o backup da versão anterior à otimização, inventário, manifesto e verificação da pipeline foram baixados para `.deploy/releases/optimized-ci/`. Nenhum backup foi colocado no document root público.

### Limites

INP de campo não medido; TBT não é tratado como INP. Os resultados Lighthouse são medições de laboratório nas condições documentadas. Certificações sem comprovantes públicos não foram adicionadas. A página 404 existe, mas nenhuma regra global `ErrorDocument` foi inserida para proteger as outras aplicações. O conteúdo eleitoral não promete dados em tempo real, e os gráficos/topologia são demonstrações conceituais.

Relatórios completos JSON/HTML, screenshots e testes permanecem em `artifacts/` local; versões sanitizadas dos resultados estão em `docs/reports/` e a execução de CI é pública. Nenhum relatório inclui senha, token, endpoint interno ou conteúdo da aplicação protegida.
