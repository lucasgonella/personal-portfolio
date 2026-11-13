# Missão 02 — diagnóstico e direção de intervenção

Data: 2026-11-13. Base local `886b53d`, aplicação publicada `d40a701`. Working tree limpo e `origin/main` em `5261cdf` após fetch. Continuidade, cinco papéis, regras e memória `default / gonella-site-pessoal` consultados antes da intervenção. O proprietário autorizou atualizar `lucasgonella/personal-portfolio` e confirmou explicitamente FTP convencional no escopo restrito, com backup.

## Auditoria inicial

| Problema | Evidência | Impacto para visita de 30 segundos | Severidade | Solução proposta |
| --- | --- | --- | --- | --- |
| Headline abstrata | H1 público: “Engenharia por trás do que importa.”; especialização e experiência dependem de texto menor | Não comunica imediatamente o campo de atuação | Alta | Headline direta de infraestrutura, automação e confiabilidade; contexto corporativo e cargo atual visíveis |
| Trajetória profissional aparece depois de explorer e cinco projetos | Ordem real dos elementos `main section` capturada via navegador | O visitante vê laboratório antes de entender senioridade | Alta | Aproximar perfil/experiência do hero; distinguir atuação, prática pública e direção profissional |
| Decisões e validação ficam escondidas | Cards mostram descrição e ferramentas; problema/arquitetura/escopo dependem de expansão | Evidência de engenharia exige mais cliques | Alta | Resumo verificável visível e detalhes com decisão técnica, validação e referência pública |
| Evolução para Platform não está representada | Contexto novo do proprietário inclui Platform Engineer; conteúdo atual só DevOps/SRE | Posicionamento incompleto | Média | Incluir Platform como direção, sem promovê-lo a cargo atual |
| Topologia tem pouca orientação contextual | Sete nós conceituais, controles equivalentes; câmera não tem reset | Interação interessante, mas pode perder perspectiva e contexto | Média | Melhorar seleção, reset de perspectiva e explicação; preservar 3D e fallback |
| Motion carrega mesmo com redução de movimento inicial | Effect de GSAP sempre importa módulos após timer | Transferência desnecessária em experiência estática | Média | Adiar módulo até haver preferência e viewport apropriados, com tratamento de falha |
| Grande concentração de JSX em App | Seções inteiras em linhas muito extensas | Revisão e alterações entre agentes ficam mais difíceis | Média | Extrair seções reutilizando semântica, dados, CSS e IDs existentes |
| Fallback FTP automático depende só de AUTH não suportado | `connect()` abre FTP antes de exigir confirmação específica | Não representa a nova restrição operacional | Alta | Exigir opt-in explícito em variável de ambiente e testar bloqueio antes do login |
| GitHub ainda não contém o bootstrap anterior | `origin/main=5261cdf`, três commits locais posteriores | Outros checkouts não recebem instruções e correções | Alta | Publicar histórico e melhorias por push normal, verificando divergência e CI |

## Evidências e limites

Captura direta via Playwright/Edge em `artifacts/mission02-before/`: páginas atuais retornam o cargo correto; navegação/cena inicial sem erros de JavaScript ou requisições falhas. A leitura web indexada retornou conteúdo antigo; não foi usada como prova do estado atual. Baseline anterior do mesmo build: performance 99 mobile/100 desktop, demais categorias 100; não representa nova medição de campo.

Projetos: README público de homelab e plataforma eleitoral reconsultados. A descrição do laboratório é separada de experiência profissional; endereços e detalhes internos não serão copiados. O conteúdo de métricas e Terraform será validado contra arquivos realmente disponíveis, sem inventar testes de integração ou infraestrutura provisionada.

## Direção aprovada pelo pedido atual

Preservar React/TypeScript/Vite, Three.js, GSAP, fontes locais, identidade grafite/menta, URLs PT/EN, controles HTML e fallback SVG. Evoluir a composição editorial e a jornada para hero → perfil/experiência → especializações → projetos → homelab/explorer → contato. Mais evidência de sistemas, menos texto abstrato. Nenhum backend ou biblioteca de UI nova.

Os testes, resultados reais, limitações e mudanças de decisão serão adicionados após execução. Este diagnóstico não encerra a missão.
