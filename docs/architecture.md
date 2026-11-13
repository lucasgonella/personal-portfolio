# Arquitetura — Gonella Personal Website

## Origem verificada em 2026-11-13

O diretório local inicialmente tinha apenas `.env`, sem `.git`. O marcador público `gonella-portfolio-v1/ownership.json` identificou `lucasgonella/personal-portfolio`; os arquivos e o histórico desse repositório foram recuperados, preservando o `.env`. Revisão original: `5261cdf811f24ad0be50595cf74db988d9e2f85a`. Não se trata de um projeto novo sem implementação anterior.

## Stack e estrutura

React 19.3.0, TypeScript 6.0.3, Vite 7.3.7, Three.js 0.186.1, GSAP 3.15.0 e CSS autoral em camadas. Node >=24, npm com lockfile e Python 3.13 para operação FTP. Overrides oficiais WebAssembly de Rollup/esbuild já existentes contornam restrições históricas do Windows. Não há backend em runtime.

| Caminho | Responsabilidade |
| --- | --- |
| `src/App.tsx` | Seções, navegação e interações React |
| `src/components/` | Hero, perfil, especializações, projetos e explorer em componentes separados; `ProjectCard` concentra evidência/expansão |
| `src/engineering.ts` | Decisões técnicas, validação, limites e referências públicas dos cinco projetos |
| `src/usePortfolioMotion.ts` | Motion opcional somente quando preferência, viewport e economia de dados permitem |
| `src/content.ts`, `src/projects.ts` | Conteúdo bilíngue e curadoria editorial |
| `src/data/projects.json` | Snapshot de metadados públicos GitHub |
| `src/SceneHost.tsx`, `src/scene.ts` | Carregamento progressivo e cena Three.js |
| `src/visuals.tsx`, `src/styles.css` | Visuais demonstrativos, tokens e responsividade |
| `scripts/prerender.mjs` | HTML completo PT-BR e EN, metadados e publicação estática |
| `scripts/ftp.py` | Inventário, manifesto, publicação e rollback restritos |
| `tests/` | Testes de isolamento FTP e Playwright/axe |
| `.github/workflows/portfolio.yml` | CI e publicação manual já existentes; não executados por este bootstrap |
| `docs/`, `agents/roles/` | Decisões, procedimentos, handoff e responsabilidades |

`npm run build` gera `dist/`, SSR temporário em `.deploy/ssr` e manifesto com SHA-256. `dist/`, `.deploy/`, `.private/`, relatórios, dependências e segredos não são versionados. Apenas artefatos públicos da allowlist são transferidos.

## Internacionalização e integração

PT-BR em `/`; EN em `/gonella-portfolio-v1/en/`. Preservar URLs, canonical, hreflang e paridade funcional/conteúdo. HTML pré-renderizado garante leitura sem JavaScript. Metadados GitHub são atualizados por script de build, sem chamadas contínuas no navegador.

Na missão 02, a composição passou para hero → perfil/experiência → especializações → projetos → homelab/explorer → contato. IDs públicos foram preservados e `#expertise` foi acrescentado. O hero permite selecionar quatro camadas com equivalência em SVG/WebGL; o explorer tem oito nós e reset de perspectiva. O estado de seleção e a expansão de projetos continuam em React, sem nova dependência ou backend. Cargo atual e direção DevOps/SRE/Platform são dados distintos.

ai-memory: `.ai-memory.toml` define `default / gonella-site-pessoal`. MCP disponível e validado por escrita/releitura e `memory_status` com `resolved_by: explicit`. Cliente Windows 3.3.1, servidor MCP identificado como 3.3.0. WSL existente usa cliente 3.1.1 e outro servidor: não usar como rota equivalente. Captura Codex real comprovada; Claude Code tem MCP e hooks no mesmo endpoint, ainda sem sessão real validada. Os 13 eventos anteriores à criação do marker e a linha desta sessão ficaram no fallback `default / gonella.com.br`: migração administrativa pendente, negada com 403 à credencial atual. `doctor` também requer operação administrativa. Não alterar permissões. Diagnóstico e procedimento em [ai-memory.md](ai-memory.md).

## Referências

Regras em `../AGENTS.md`; operação em `deploy-ftp.md`; direção visual em `design-system.md`; estado em `HANDOFF.md`. Documentos `design.md`, `deploy.md`, `validation.md` e relatórios de outubro são históricos e devem ser interpretados com suas datas.
