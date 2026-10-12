# Evidências de validação

## Condições

Validações executadas em outubro de 2026, Windows, Node 24.21.0, Python 3.13.14 e Edge instalado. O Chromium baixado foi bloqueado pelo controle de aplicações do Windows; o navegador Edge foi usado realmente, não simulado. Testes de navegador via Playwright 1.64.0, viewport desktop 1440×1000 e perfil mobile iPhone 13 em engine Chromium/Edge.

Lighthouse 13.5.0: três páginas representativas. Mobile usa o preset de throttling simulado padrão do Lighthouse (rede e CPU); desktop usa RTT 40 ms, throughput 10.240 Kbps e CPU 1×. Relatórios JSON/HTML incluem configurações, data e user agent efetivos. Não representam SLA, tráfego real nem resultado uniforme em todos os dispositivos.

## Verificações locais executadas

- Lint e typecheck aprovados.
- Build estático PT/EN com prerenderização aprovado.
- 4 testes da publicação: allowlist e traversal; porta obrigatória 21; ausência de comandos de exclusão; rollback simulado com checksums e índice por último.
- 10 testes Playwright aprovados, abrangendo PT/EN, navegação mobile, seleção da topologia, detalhes de projetos, timeline, contexto da stack, movimento reduzido, teclado, auditoria WCAG, WebGL explícito, pausa e perda de contexto.
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

## Produção

Resultados da publicação e verificação externa serão registrados após a execução. Arquivos de evidência locais: `.deploy/verification.json`, `artifacts/production-http.json`, `artifacts/e2e-results.json`, `artifacts/lighthouse/production-*.json` e HTML correspondentes. O relatório público descreve resultados e limitações sem incorporar credenciais ou conteúdo das aplicações protegidas.
