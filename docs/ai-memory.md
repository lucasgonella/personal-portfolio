# ai-memory — escopo, integração e evidências

## Rota comprovada

`.ai-memory.toml` define exatamente workspace `default`, project `gonella-site-pessoal`. Todas as chamadas MCP deste trabalho para páginas duráveis passaram os dois argumentos explicitamente. Escrita, releitura, busca e `memory_status` confirmaram `resolved_by: explicit`. Usar esse escopo para este portfólio; não copiar decisões de produto ou infraestrutura por coincidência de nome.

MCP Codex: launcher Windows existente, bridge sem session-id e servidor identificado como ai-memory 3.3.0; cliente Windows 3.3.1. Hooks Codex capturam observações reais desta sessão, confirmadas por `memory_read_session_observations`. Claude Code tem MCP HTTP autenticado e hooks globais no mesmo endpoint local, além de `CLAUDE.md` apontando para `AGENTS.md`. A execução real de uma sessão Claude neste projeto ainda precisa ser validada.

Instalação WSL Ubuntu-24.04 preservada, cliente 3.1.1: seu `doctor` reconhece o marker, mas acessa outro servidor, no qual o projeto não existe. Não usar esse CLI como prova do estado do MCP atual. Não foram reinstalados componentes, mudadas permissões ou copiados tokens.

## Páginas realmente persistidas

| Namespace | Caminhos |
| --- | --- |
| `_rules/` | `seguranca-e-colaboracao.md` |
| `decisions/` | `arquitetura-inicial.md`, `design-e-internacionalizacao.md`, `auditoria-e-intervencao-2026-11.md` |
| `procedures/` | `build-e-testes.md`, `deploy-backup-rollback.md`, `validacao-pos-deploy.md` |
| `gotchas/` | `integracao-e-servidor.md`, `build-e-progressive-enhancement.md`, `eventos-anteriores-ao-marker.md` |
| `working/` | `estado-atual.md` |

Onze páginas criadas via `memory_write_page`, todas iniciadas por H1. Atualizações posteriores usaram releitura e `expected_page_id`. Nenhum segredo foi incluído. O índice e o procedimento de deploy foram atualizados durante o trabalho, antes do encerramento.

## Pendência retroativa de captura

Esta sessão começou antes da existência do marker. Os primeiros 13 eventos brutos e a linha da sessão foram gravados pelo hook no fallback `default / gonella.com.br`; nenhuma página durável existe nesse fallback. Após criar o marker, os eventos posteriores passaram ao escopo desejado. A sessão é `01a1d4fb-7b44-7532-ba6a-26f709e97efc`. A consulta pelo novo projeto reportou `elided_other_scope: 13`, e o status explícito do fallback confirmou as contagens.

O dry-run abaixo, com a credencial atual, foi recusado com HTTP 403: operação administrativa restrita a root. Nada foi movido ou removido. Também `doctor` Windows exige uma operação administrativa que essa credencial não possui. Não declarar a migração concluída ou isolamento retroativo completo.

Depois que esta sessão terminar, um administrador **do mesmo servidor MCP** pode revisar:

```sh
ai-memory move-session 01a1d4fb-7b44-7532-ba6a-26f709e97efc --to gonella-site-pessoal --to-workspace default
```

Sem `--confirm`, é simulação. Após revisar, o administrador pode confirmar a mesma migração com `--confirm` e verificar contagens/observações nos dois escopos. Não usar `--force`, migração em lote, purge ou outro servidor por conveniência. Nenhuma permissão extra foi solicitada ou alterada neste trabalho.

Novas sessões no diretório já encontrarão o marker desde o início. Validar captura em uma nova sessão Codex e em uma sessão Claude Code antes de concluir a validação entre clientes.
