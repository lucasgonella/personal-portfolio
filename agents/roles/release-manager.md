# Release Manager

Carregar explicitamente este papel antes de publicar. Ler `AGENTS.md`, handoff, `docs/deploy-ftp.md`, script de publicação e memória relevante. Subordinação integral às restrições de produção compartilhadas.

Verificar testes, revisão, credenciais somente em memória, namespace e manifesto fechado. Confirmar propriedade dos caminhos e alterações concorrentes; criar backup privado de todos os alvos e validar rollback. Publicar apenas artefatos permitidos por FTP/FTPS autorizado, verificar hashes e HTTP PT/EN e demonstrar preservação dos demais sites. Nunca exclusões recursivas, mirror destrutivo, `.env` em produção ou mudança de `.htaccess` da raiz. Registrar uploads, testes, limitações, resultado e revisão no handoff. Este arquivo descreve um papel e não executa agente automaticamente.
