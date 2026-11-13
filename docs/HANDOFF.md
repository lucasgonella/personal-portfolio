# Handoff — Codex / Claude Code

## Situação em 2026-11-13 — implementação testada, antes do deploy

Pedido: inicializar colaboração e memória, auditar/melhorar portfólio existente, testar e publicar por FTP seguro. Bootstrap, auditoria e implementação concluídos; publicação e validação final ainda pendentes nesta revisão.

Diretório iniciou apenas com `.env`. Fonte identificada por marcador FTP e recuperada de `lucasgonella/personal-portfolio`, com histórico e HEAD original `5261cdf811f24ad0be50595cf74db988d9e2f85a`. `.env` preservado, ignorado e não impresso. Branch `codex/bootstrap-and-portfolio-improvements`; ainda nenhuma escrita remota. Revisão da implementação será registrada no resultado da publicação.

## Concluído

- Reconhecimento de stack, histórico, deploy, documentação e diretórios remotos.
- `AGENTS.md`, `CLAUDE.md`, `.ai-memory.toml`, exclusões de segurança; documentação compartilhada e papéis de referência.
- Sete páginas iniciais e duas páginas adicionais de auditoria/build persistidas por MCP em `default / gonella-site-pessoal`; escrita/releitura e scope explícito confirmados. Índice e procedimento operacional já atualizados com versão esperada.
- Snapshot privado dos arquivos públicos principais com hashes em `.private/origin-2026-11-13/`.
- Implementadas melhorias de conteúdo, UX, fallback sem JS, 3D/movimento e SEO localizado; detalhes e evidências em `audit-2026-11.md`.
- Publicador lê `.env`, tenta FTPS, valida backup integral dos alvos, bloqueia concorrência e restaura PT/EN no rollback. Nove testes operacionais passaram.
- Typecheck, lint, build e 22 testes Playwright/Edge passaram. Axe WCAG sem violações nos dois idiomas. Capturas revisadas em desktop/mobile.
- Inventário FTP comprovou namespace e árvores protegidas; backup dos alvos em `.deploy/backup/targets/`. Repetição de inventário arquiva estado anterior em `.deploy/releases/`.

## Riscos e pendências

- FTP não suporta FTPS; caminho do `.env` é de sistema, não caminho navegável da sessão FTP. `/public_html` comprovado.
- Outros diretórios de aplicações são protegidos. Nunca modificar/remover.
- Rollback ampliado foi testado em host simulado; não foi disparado desnecessariamente em produção.
- Hooks Codex realmente capturam esta sessão (observações lidas via MCP). Claude global MCP HTTP e hooks estão configurados no mesmo endpoint local, mas sessão Claude real ainda não validada. Servidor WSL é diferente e foi preservado; `doctor` Windows requer operação root.
- Node global 26.13.0 falhou por entropia OpenSSL; build aprovado com Node 24.22.3 oficial portátil em `.tools/node24/`, SHA-256 validado. `.nvmrc` fixa a versão; não há alteração global.
- Auditoria runtime sem vulnerabilidades; auditoria completa mantém 11 moderadas em tooling de lint. Não aplicar force fix/downgrade automaticamente.
- Relatórios em `docs/reports/` e docs originais são de outubro; não comprovam testes atuais.

## Próxima ação

Registrar revisão, publicar manifesto já testado e inventariado; validar HTTP/FTP, navegador PT/EN e Lighthouse, confirmar preservação das árvores protegidas e concluir handoff. Não recomeçar do zero.
