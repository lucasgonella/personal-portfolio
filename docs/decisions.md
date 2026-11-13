# Registro de decisões

| Data | Decisão e justificativa | Trade-off / evidência | Página ai-memory |
| --- | --- | --- | --- |
| 2026-11-13 | Isolar portfólio em `default / gonella-site-pessoal` | MCP explícito evita servidor/projeto implícito; marker validado também pelo cliente WSL | `_rules/seguranca-e-colaboracao.md` |
| 2026-11-13 | Recuperar fonte original e histórico em vez de recriar | Marcador FTP → GitHub `lucasgonella/personal-portfolio`; HEAD original `5261cdf` | `decisions/arquitetura-inicial.md` |
| 2026-11-13 | Preservar React/TS/Vite, CSS, Three.js/GSAP e URLs PT/EN | Evita regressões e dependências novas; alterações posteriores precisam auditoria | `decisions/design-e-internacionalizacao.md` |
| 2026-11-13 | Centralizar regras em AGENTS; CLAUDE referencia | Papéis são documentos, sem automação de subagentes | `_rules/seguranca-e-colaboracao.md` |
| 2026-11-13 | Usar MCP comprovado; preservar instalações Windows/WSL distintas | CLI WSL não encontra este projeto em seu servidor; doctor Windows bloqueado por permissão admin | `gotchas/integracao-e-servidor.md` |
| 2026-11-13 | FTP restrito com backup integral dos alvos | FTPS não suportado; exclusões proibidas; aprimorar rollback existente antes de publicar | `procedures/deploy-backup-rollback.md` |

Páginas acima foram realmente persistidas via `memory_write_page` no escopo indicado. Também persistidas `procedures/build-e-testes.md` e `working/estado-atual.md`. Não confundir conhecimento histórico com autorização operacional. Adições e substituições de decisões devem incluir justificativa e evidência.
