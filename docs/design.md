# Direção visual — GONELLA / infraestrutura em camadas

Pesquisa feita em outubro de 2026. As referências principais foram abertas via web e em navegador Edge. Capturas e métricas de observação permanecem locais em `artifacts/references/`, sem incorporação de assets protegidos ao site.

## Referências e decisões

| Fonte | Observação | Decisão autoral |
| --- | --- | --- |
| [Linear](https://linear.app/) | Fundo quase preto, títulos claros, ritmo de detalhes de interface e pouca distração. Página consultada com changelog de outubro de 2026. | Escala tipográfica editorial, superfícies de grafite e microdetalhes que identificam camadas de engenharia. |
| [Vercel](https://vercel.com/) | Forma central forte, grid técnico, identidade monocromática e composição com espaço negativo. | Núcleo modular próprio; nenhum triângulo, globo genérico ou cópia de componente. |
| [Apple](https://www.apple.com/) | Hierarquia precisa entre título, objeto e chamada para ação; imagens de produto como centro de atenção. | Hero imediato e legível, com estrutura tridimensional integrada à headline. |
| [Lusion](https://lusion.co/) e [Infinite Passerella](https://lusion.co/projects/infinite_passerella/) | Narrativa 3D, materiais e interação como parte da experiência. A captura inicial em headless ficou no loader; a descrição pública do projeto complementou a pesquisa. | Geometria procedural com luz e camadas; fallback visível imediatamente, sem loader artificial. |
| [Raycast](https://www.raycast.com/) | Contraste, profundidade e gestos pequenos de interação em uma identidade forte. | Um único acento principal mint/ciano e violeta seletivo para automação. |
| [Active Theory](https://activetheory.net/) | Canvas imersivo dominante; carregamento inicial headless limitou observação visual completa. | 3D com conteúdo HTML equivalente e navegação convencional acessível. |
| [14islands](https://www.14islands.com/) | Composição editorial, tipografia grande e relação entre design e tecnologia. | Seções com composição variável e narrativa de pensamento sistêmico. |
| [Awwwards](https://www.awwwards.com/) | Página atual apresentou Nick Ho como Site of the Day de 11/10/2026; galerias de 2025 mostram portfólios com autoria tipográfica e layouts menos uniformes. | Curadoria de cinco projetos e variação de proporções; o site não alega prêmio. |
| [Godly](https://godly.website/) | Biblioteca visual com composição, motion e interfaces diversas. | Pesquisa de linguagem, sem copiar templates ou assets. |
| [Rauno Freiberg](https://rauno.me/) / [registro de portfólio 2025](https://www.awwwards.com/websites/web-interactive/?page=5) | Interações pontuais, tipografia e personalidade visual clara. | Interatividade tem propósito: explicar uma tecnologia e abrir evidência pública. |

## Conceito

“Engenharia por trás do que importa.” O objeto central representa camadas que se conectam: computação, automação e observabilidade. São módulos tridimensionais criados em código, com faces, slots, linhas de luz e suportes; a rolagem abre sutilmente as camadas.

O Infrastructure Explorer transforma essa linguagem em uma topologia conceitual com sete nós. Cada nó conecta uma área técnica a um projeto real. Ligações não representam a rede interna nem afirmam que todos os projetos operam juntos. Indicadores e gráficos são demonstrativos.

O site progride de identidade → filosofia → exploração técnica → evidências dos projetos → trajetória → contexto das ferramentas → contato. As seções têm funções diferentes. Os cinco showcases usam diagramas específicos: virtualização, fluxo de dados, entrega, provisionamento e observabilidade.

## Sistema e movimento

Manrope variável para composição editorial; IBM Plex Mono para índices e rótulos técnicos. Preto grafite, off-white, mint/ciano e violeta discreto. Bordas finas, superfícies sólidas e transparência somente no cabeçalho.

Entrada imediata sem splashscreen. Three.js responde ao cursor, à seleção e à rolagem; OrbitControls permite mudar a perspectiva da topologia. GSAP orquestra deslocamentos de entrada sem ocultar o conteúdo inicial. Hover desloca cards e responde nos elementos internos. Sem cursor artificial ou rolagem substituída.

No mobile e com restrição de movimento, arte SVG detalhada mantém a identidade. Texto, navegação e os controles dos nós continuam operando sem WebGL. Um botão permite ativar 3D explicitamente. O movimento pode ser pausado.
