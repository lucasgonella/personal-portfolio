# GONELLA — personal portfolio

Portfolio de Lucas Gonella: infraestrutura, automação, cloud e confiabilidade.

Produção: **https://gonella.com.br/** · Inglês: **https://gonella.com.br/gonella-portfolio-v1/en/**

## Desenvolvimento

Requer Node.js 24 LTS e Python 3.13. Dependências têm versões fixas e lockfile.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

No Windows desta sessão, o controle de aplicações bloqueia binários nativos de bundlers e o Chromium baixado. Rollup e esbuild usam suas distribuições oficiais WebAssembly. Os testes podem usar Edge instalado:

```powershell
$env:TEST_BROWSER_CHANNEL = 'msedge'
npm run test:e2e
```

Node portable instalado e verificado em `.tools/` é local e ignorado. Não é necessário ao servidor Locaweb.

## Arquitetura

- React 19, TypeScript 6 e Vite 7.3.7. CSS autoral em camadas, sem framework de UI.
- Build estático com prerenderização React em PT e EN; conteúdo completo funciona sem JavaScript e é indexável.
- Three.js cria toda a geometria em código. Hero modular e topologia interativa compartilham um chunk carregado sob demanda; materiais, shaders e recursos são liberados no descarte.
- Arte SVG própria aparece imediatamente. WebGL usa DPR limitado, 30 FPS, compilação assíncrona de shaders e pausa fora de tela/aba. Mobile, economia de dados e movimento reduzido usam SVG com ativação 3D opcional.
- GSAP/ScrollTrigger é carregado sob demanda e respeita a preferência inicial de movimento reduzido. Sem scroll hijacking ou cursor customizado.
- Explorer tem sete controles HTML acessíveis equivalentes aos objetos 3D. Seleção atualiza o painel e liga ao projeto público correspondente.
- Showcases usam SVG/CSS/HTML próprios, identificados como demonstrativos. Sem screenshots de infraestrutura interna ou telemetria real.
- Sem backend, formulário que simula envio, analytics de terceiros ou chamadas GitHub pelo navegador.
- Manrope e IBM Plex Mono servidos localmente em WOFF2; licenças OFL nos pacotes de origem.

`src/content.ts` contém textos PT/EN, ferramentas, nós conceituais e canais públicos. `src/projects.ts` contém a curadoria editorial. `src/data/projects.json` contém apenas metadados públicos atualizados no build.

## Atualizar projetos

```sh
npm run refresh:projects
npm run build
```

São quinze chamadas por atualização para cinco repositórios, nunca chamadas contínuas no navegador. Se uma consulta falhar, o script aborta sem substituir o snapshot anterior. `GITHUB_TOKEN` é opcional e usado somente em memória no build. Descrições e escopos continuam sob revisão editorial; roadmap não vira funcionalidade automaticamente.

## Publicação

Leia [deploy e rollback](docs/deploy.md), [pesquisa de projetos](docs/project-research.md), [direção visual](docs/design.md) e [validação](docs/validation.md).

FTP convencional na porta **21**, modo passivo e transferências binárias. Não usa SSH, SFTP, FTPS, mirror ou exclusão remota. `.secrets/ftp.env` permanece local, fora do Git.

GitHub Actions valida pushes e PRs. Publicação ocorre somente com `workflow_dispatch`, `deploy=true`, branch `main`. Os quatro secrets têm os nomes efetivamente encontrados no arquivo local:

```text
LOCAWEB_FTP_HOST
LOCAWEB_FTP_USER
LOCAWEB_FTP_PASSWORD
LOCAWEB_FTP_PORT
```

O namespace exclusivo `gonella-portfolio-v1/` tem um marcador de propriedade e uma lista de arquivos controlados. A raiz usa uma allowlist fechada. `/estudos`, `/img`, o `.htaccess` da raiz e arquivos desconhecidos não são destinos permitidos. A configuração Apache própria dentro do namespace só comprime/cacheia o portfólio. Não são apagados assets antigos.

## SEO e acesso

HTML semântico, idiomas em URLs próprias, hreflang, canonical, Open Graph próprio, sitemap, robots e JSON-LD de pessoa, site e repositórios. Links externos usam `noopener noreferrer`. A página `404.html` pode ser acessada diretamente; nenhuma regra de erro é inserida no `.htaccess` de outras aplicações.

Não foram presumidos empregadores, certificações, datas de carreira, disponibilidade ou resultados comerciais. A formação de 2021 foi fornecida pelo proprietário. Topologia e gráficos são conceituais.
