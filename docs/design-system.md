# Sistema visual e interação

## Base existente verificada

Preservar a identidade GONELLA existente: grafite `#090b0d`, superfície `#101416`, texto `#f0f3ef`, secundário `#9fa9a5` e menta `#b6f4da`. Manrope Variable para interface/títulos e IBM Plex Mono para contexto técnico; fontes locais WOFF2 com licenças em `licenses/`.

CSS autoral em `src/styles.css`, com camadas reset/base/components/responsive. Gutter fluido entre 24 e 88 px, seções amplas, tipografia responsiva e pontos de adaptação existentes em 767/1100 px. Consultar código antes de adicionar tokens divergentes.

## Conteúdo, UI e 3D

Fluxo existente: hero → abordagem → topologia explorável → projetos → trajetória → stack → contato. O cargo atual deve ser inequívoco, e o objetivo DevOps/SRE distinguido da experiência já comprovada. Projetos devem explicar problema, implementação e limites, sem métricas inventadas.

Hero 3D e topologia são representações conceituais. Fallback SVG imediato; controles HTML acessíveis equivalentes aos nós. Visuais de projetos e gráficos são demonstrativos, sem telemetria real. Nunca insinuar que animação representa produção ou uptime observado.

## Movimento e acessibilidade

Movimento deve ajudar orientação. Respeitar `prefers-reduced-motion`, economia de dados, visibilidade da aba e viewport; manter fallback sem WebGL. Evitar scroll hijacking. Navegação por teclado, foco visível, skip link, nomes acessíveis e estados `aria-expanded`/`aria-pressed` coerentes. Texto e ações essenciais permanecem acessíveis sem JavaScript.

Validar contraste, viewport móvel 320/390 px, desktop, PT/EN, teclado, movimento reduzido e falhas de clipboard/WebGL. Lighthouse é medição de laboratório; Core Web Vitals de campo e INP não são presumidos.

## Evolução

Em novembro de 2026, a auditoria guiou uma evolução da identidade existente: cargo atual legível/localizado, bloco menta separado para direção de carreira e três caminhos editoriais para evidências técnicas. Cards de projetos, hero 3D e explorer foram preservados. O movimento responde à troca de preferência em runtime; ativação manual em reduced-motion inicia pausada. Detalhes e navegação permanecem acessíveis sem JavaScript. Ver `audit-2026-11.md`, `decisions.md` e `HANDOFF.md` para evidências.
