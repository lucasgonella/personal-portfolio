# Registro de decisões

| Data | Decisão e justificativa | Trade-off / evidência | Página ai-memory |
| --- | --- | --- | --- |
| 2026-11-13 | Isolar portfólio em `default / gonella-site-pessoal` | MCP explícito evita servidor/projeto implícito; marker validado também pelo cliente WSL | `_rules/seguranca-e-colaboracao.md` |
| 2026-11-13 | Recuperar fonte original e histórico em vez de recriar | Marcador FTP → GitHub `lucasgonella/personal-portfolio`; HEAD original `5261cdf` | `decisions/arquitetura-inicial.md` |
| 2026-11-13 | Preservar React/TS/Vite, CSS, Three.js/GSAP e URLs PT/EN | Evita regressões e dependências novas; alterações posteriores precisam auditoria | `decisions/design-e-internacionalizacao.md` |
| 2026-11-13 | Centralizar regras em AGENTS; CLAUDE referencia | Papéis são documentos, sem automação de subagentes | `_rules/seguranca-e-colaboracao.md` |
| 2026-11-13 | Usar MCP comprovado; preservar instalações Windows/WSL distintas | CLI WSL não encontra este projeto em seu servidor; doctor Windows bloqueado por permissão admin | `gotchas/integracao-e-servidor.md` |
| 2026-11-13 | FTP restrito com backup integral dos alvos | FTPS não suportado; exclusões proibidas; aprimorar rollback existente antes de publicar | `procedures/deploy-backup-rollback.md` |
| 2026-11-13 | Refinar a identidade existente e clareza para recrutamento | Cargo atual separado do objetivo DevOps/SRE, caminhos para evidências e conteúdo de laboratório atualizado com atribuição | `decisions/auditoria-e-intervencao-2026-11.md` |
| 2026-11-13 | Corrigir CLS detectado depois da primeira publicação | Detecção de JavaScript no head evita recolhimento tardio da navegação; teste com módulo atrasado preserva fallback sem JS | `gotchas/build-e-progressive-enhancement.md` |
| 2026-11-13 | Manter pendente a migração de eventos anteriores ao marker | 13 eventos no fallback; dry-run de migração negado por HTTP 403 root-only. Não contornar permissões | `gotchas/eventos-anteriores-ao-marker.md` |
| 2026-11-13 / missão 02 | Perfil e experiência antes do laboratório; decisões dos projetos visíveis | Comunica senioridade em 30 segundos e diferencia trabalho corporativo de prática pública; preserva stack/URLs | `decisions/missao02-posicionamento-e-jornada.md` |
| 2026-11-13 / missão 02 | Interação de quatro camadas no hero, segurança no explorer e reset de câmera | Geometria existente evoluída com equivalência SVG/HTML e sem biblioteca nova | `decisions/missao02-posicionamento-e-jornada.md` |
| 2026-11-13 / missão 02 | Opt-in de FTP sem criptografia antes do login | Exigência explícita da missão; autorização do proprietário recebida e script recusa fallback sem variável de sessão | `decisions/missao02-posicionamento-e-jornada.md` |

Páginas acima foram realmente persistidas via `memory_write_page` no escopo indicado. Relação das treze páginas e estado entre clientes em [ai-memory.md](ai-memory.md). Não confundir conhecimento histórico com autorização operacional. Adições e substituições de decisões devem incluir justificativa e evidência.
