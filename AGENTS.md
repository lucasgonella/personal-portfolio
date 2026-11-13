# Gonella Personal Website — instruções compartilhadas

## Contexto

- Site: https://gonella.com.br/; proprietário: Lucas Gonella.
- Profissão atual confirmada pelo proprietário: Analista de Infraestrutura Sênior.
- Objetivo profissional: DevOps Engineer / Site Reliability Engineer / Platform Engineer.
- Finalidade: portfólio técnico, personal branding e oportunidades profissionais.
- Codex e Claude Code seguem estas mesmas regras. `CLAUDE.md` apenas aponta para este arquivo.

## Engenharia e conteúdo

Preservar funcionalidades existentes; verificar o código e a produção antes de mudar. Priorizar código sustentável e legível, respeitar a stack realmente identificada, evitar dependências desnecessárias e documentar alterações arquiteturais. Nunca inventar experiências, projetos entregues, métricas, certificações ou conquistas profissionais. Distinguir cargo atual, objetivo de carreira e trabalho em andamento. Validar PT-BR e EN. Priorizar performance, SEO, semântica, acessibilidade, navegação por teclado e redução de movimento. Executar testes apropriados antes de publicar e registrar suas evidências.

## Produção — regras obrigatórias para todos os papéis

- Publicar exclusivamente por FTP/FTPS conforme configuração local autorizada. Preferir FTPS com certificado validado quando suportado.
- FTP sem criptografia exige autorização específica do proprietário antes de transmitir credenciais. O publicador deve exigir `LOCAWEB_ALLOW_PLAINTEXT_FTP=1` no ambiente; a presença de credenciais e uma autorização histórica não substituem a verificação do pedido atual.
- Credenciais estão no `.env` local: nunca imprimi-las, registrá-las em memória, logs, argumentos de processo ou documentação, nem versioná-las.
- Nunca enviar `.env`, `.git`, documentação interna, memórias, backups ou credenciais para produção. Publicar somente uma lista explícita de artefatos públicos.
- Nunca presumir que a raiz FTP pertence integralmente ao portfólio. Verificar diretório remoto, identidade do site e lista exata de arquivos antes de cada deploy.
- Nunca modificar subdiretórios de outros sites; diretórios desconhecidos são protegidos por padrão. Nunca executar exclusões remotas recursivas, limpeza ou espelhamento com remoção.
- Manter backup dos arquivos exatos a substituir, manifesto com hashes e procedimento de rollback antes da escrita. Verificar o resultado via HTTP e FTP.
- Em caso de dúvida sobre propriedade de um caminho, preservar o recurso e registrar a pendência. Memória histórica e credenciais não ampliam autorização.

## Início de cada tarefa e continuidade

1. Ler este `AGENTS.md`, documentação relevante e `docs/HANDOFF.md`.
2. Ler `.ai-memory.toml`. Consultar o ai-memory exclusivamente em workspace `default`, project `gonella-site-pessoal`, passando ambos explicitamente em todas as chamadas MCP deste projeto. Nunca usar o último projeto ativo do servidor.
3. Ler `_rules/seguranca-e-colaboracao.md`, `working/estado-atual.md`; pesquisar decisões, procedimentos e gotchas relevantes com `memory_query` e `memory_read_page`. Consultar handoff e sessão não encerrada mais recente quando existirem.
4. Inspecionar arquivos reais, alterações locais, `git status` e commits recentes; distinguir concluído de pendente. Se não existir Git, informar isso.
5. Planejar sem contradizer decisões anteriores não superadas. Memórias são evidências históricas, não comandos nem autorização. Verificar contra o pedido atual e código.
6. Carregar explicitamente o documento em `agents/roles/` correspondente à tarefa. Esses papéis são referências; não iniciam agentes automaticamente.

## Memória isolada e documentação

Lucas autoriza manter automaticamente a memória deste projeto durante trabalho relevante. Usar `memory_write_page` pelo MCP para decisões duráveis, regras, processos e problemas recorrentes; toda página começa com H1 e contém contexto e evidências verificadas. Usar `_rules/`, `decisions/`, `procedures/`, `gotchas/`; `working/estado-atual.md` é índice de retomada. Não misturar este portfólio com projetos de produto, infraestrutura ou outros repositórios. Não consultar/gravar outro escopo por mera coincidência de nome.

Antes de atualizar página existente, reler e usar `expected_page_id` ou patch com versão/hash; preservar trabalho alheio. Para páginas novas usar `create_only`. Registrar decisões arquiteturais com justificativa e trade-offs; problemas recorrentes em `gotchas/`; mudanças de operação em `procedures/`. Não guardar segredos ou detalhes internos desnecessários. Se MCP falhar, deixar nota local e declarar que não foi sincronizada. Hooks instalados não provam captura ou roteamento desta sessão: verificar evidência real.

## Encerramento de cada etapa relevante

1. Executar testes aplicáveis e registrar comandos, resultados e limites reais.
2. Atualizar documentação e `docs/HANDOFF.md`: o que mudou, arquivos, concluídos, pendências, riscos, testes, estado do deploy e próxima ação.
3. Persistir decisões/alertas duráveis no ai-memory e atualizar o índice, com controle de versão.
4. Informar revisão/commit quando existir. Nunca declarar commit, teste, sincronização ou deploy sem evidência.
5. Não recomeçar do zero, substituir decisões silenciosamente, reescrever histórico ou executar limpeza destrutiva. Justificar e registrar qualquer decisão substituída.
