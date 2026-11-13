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

## Implementação e antes/depois

| Antes | Depois |
| --- | --- |
| Headline abstrata e contexto profissional tardio | Infraestrutura, automação e confiabilidade no hero; atuação e experiência antes dos laboratórios |
| Cards apoiados em ferramentas e detalhes escondidos | Classificação de escopo, decisão técnica e referência pública visíveis; validação e limites nos detalhes |
| Objetivo DevOps/SRE | Direção DevOps/SRE/Platform separada do cargo atual em conteúdo e metadados PT/EN |
| Hero essencialmente contemplativo | Quatro camadas selecionáveis, descrição contextual e destaque equivalente em SVG/WebGL |
| Sete nós e câmera sem retorno explícito | Oito nós, incluindo segurança, e reset de perspectiva |
| Importação opcional de motion em experiência estática | Motion não carregado inicialmente em mobile/reduced-motion/economia de dados |
| App concentrando as seções | Componentes em `src/components/`, evidências em `src/engineering.ts` e hook de motion separado; 18 regras CSS obsoletas removidas |
| Histórico do bootstrap apenas local | Histórico e implementação enviados à `main` do GitHub sem force push |

Revisões: implementação `b1ebabc0314d5e258487f9622892ec0b48b2d39c`; correção de paridade dos metadados PT/EN `940de9c0746f3b9ebc6d4c0b310b0a8cefc1750a`, que é a fonte final publicada. Os testes passaram nos dois [runs de CI](https://github.com/lucasgonella/personal-portfolio/actions). Nenhuma biblioteca foi adicionada ou atualizada.

## Testes e medições reais

Typecheck, lint e build aprovados; dez testes operacionais e **34 testes Playwright/Edge locais e 34 em produção**, sem falhas ou skips. Axe automatizado sem violações nos dois idiomas. Verificados 320/768/1024/1440 px, teclado, navegação, links internos, SEO localizado, ausência de JS/WebGL, perda de contexto, seleção de camadas, segurança, reset e carregamento adiado. As capturas PT/EN em produção não apresentaram erros de console/página ou requisições falhas.

| Perfil | Performance | Acessibilidade | Boas práticas | SEO | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| PT mobile, medição final | 99 | 100 | 100 | 100 | 0,000146 |
| PT desktop | 100 | 100 | 100 | 100 | 0,000113 |
| EN mobile | 99 | 100 | 100 | 100 | 0,000119 |

Na primeira medição PT móvel, performance foi 98; a repetição final após ajuste somente de metadados foi 99. Não atribuir a oscilação ao título: JS e CSS não mudaram entre essas publicações. Baseline anterior da mesma interface pré-missão: 99/100/99 em performance e CLS PT móvel 0,00827. O LCP PT observado passou de aproximadamente 1,87s para 2,01s, com mais conteúdo; são execuções de laboratório, sem inferência de regressão ou melhoria de campo.

O carregamento JavaScript no teste móvel passou de três scripts, **133.286 bytes transferidos**, para um script, **89.394 bytes**: cerca de 33% menos transferência. A fonte principal cresceu um pouco com a nova interação/conteúdo, mas os chunks opcionais de motion deixaram de ser baixados nesse contexto. Não há medição confiável de INP/CrUX de campo.

## Publicação e preservação

Primeira publicação: seis arquivos; alinhamento final de metadados: dois. Índice principal por último, zero exclusões. Todos os 16 artefatos do manifesto conferidos por hash FTP; 15 arquivos públicos conferidos por HTTPS. `img/` e as duas aplicações irmãs somam nove arquivos, com hashes idênticos ao primeiro inventário; `.htaccess` da raiz e `.env` original preservados. Backups/estados anteriores permanecem privados em `.deploy/backup/targets/` e `.deploy/releases/`. Não foi necessário executar rollback.

O opt-in de FTP sem criptografia é exigido antes do login e foi autorizado explicitamente pelo proprietário nesta missão. Os scripts de reconhecimento compartilham a mesma conexão protegida; o workflow manual exige escolha explícita. O CI automático de push apenas validou, sem realizar deploy.

## Limites e continuidade

Auditoria atual das dependências de runtime: zero vulnerabilidades; auditoria completa: 11 moderadas em tooling de lint. Não foram aplicadas correções major/downgrades automáticos. A migração histórica dos 13 eventos pré-marker continua exigindo administrador; a sessão real Claude ainda não foi validada. Nenhuma memória de outro projeto foi alterada.

Uma edição temporária via pipeline PowerShell/Python não preservou acentos porque `$OutputEncoding` era ASCII. A paridade de metadados incompleta foi detectada na inspeção direta, corrigida com `apply_patch` e coberta por assertions de título/description nas duas línguas. Não foram feitas mudanças globais de encoding.

Resumo sanitizado: [reports/mission02-validation.json](reports/mission02-validation.json). Capturas antes, locais e de produção em `artifacts/mission02-*`; referências técnicas dos projetos foram revistas como código/documentação pública, sem executar operações ou testes na infraestrutura de outros projetos.
