# Pesquisa dos projetos públicos de Lucas Gonella

Verificação realizada em 12 de outubro de 2026 (UTC), ainda 11 de outubro em `America/Sao_Paulo`. Foram consultados exclusivamente o perfil, metadados, árvores de arquivos, READMEs, código e execuções públicas de GitHub Actions. Não houve acesso a infraestrutura interna, repositórios privados ou FTP. Nenhum código dos projetos foi executado.

Fontes de inventário: [perfil público](https://github.com/lucasgonella), [API pública do perfil](https://api.github.com/users/lucasgonella), [repositórios públicos](https://api.github.com/users/lucasgonella/repos?per_page=100&sort=updated).

## Seleção editorial: cinco projetos

A seleção considera arquitetura, implementação verificável e variedade de competências. Os repositórios abaixo são públicos, não arquivados e não marcados como forks na API. Não foram usados stars como indicador de qualidade. Os hashes e datas registram a versão examinada; os repositórios podem continuar evoluindo.

| Ordem | Showcase | Repositório | Último commit examinado, UTC | Hash |
| --- | --- | --- | --- | --- |
| 01 | Dados públicos, do collector à publicação | [election-results-platform](https://github.com/lucasgonella/election-results-platform) | 2026-10-12 00:42:53 | `2599eae56ab3d016ca5c72cc757102c42afe6e0b` |
| 02 | Homelab: infraestrutura como laboratório | [homelab-ansible](https://github.com/lucasgonella/homelab-ansible) | 2026-09-29 02:52:34 | `77f315bf8723ceab59a3d7fb6502a5936a02a527` |
| 03 | Um artefato, do teste ao deploy | [devops-sre-lab](https://github.com/lucasgonella/devops-sre-lab) | 2026-09-06 18:35:06 | `4576d538f9cd46bd531d79c0caaae828c9b85b22` |
| 04 | Infraestrutura declarada em código | [Terraform](https://github.com/lucasgonella/Terraform) | 2026-03-06 21:44:18 | `e5bbe9bc9bcc1107a322a13da08b6c48f80a9ede` |
| 05 | Entender o sistema pelas métricas | [prometheus-grafana](https://github.com/lucasgonella/prometheus-grafana) | 2023-02-14 02:53:21 | `be816b704ce0a06d2e5220f171e202abecf067ba` |

## 01 — Election Results Platform

**Texto PT:** Uma plataforma de dados que conecta coleta de arquivos públicos do TSE, persistência em PostgreSQL e publicação de uma interface estática. Python orquestra descoberta, detecção de mudanças, processamento e geração de snapshots versionados.

**Texto EN:** A data platform connecting public TSE files, PostgreSQL persistence and a static web interface. Python orchestrates discovery, change detection, processing and versioned snapshot generation.

**Problema abordado:** transformar arquivos eleitorais publicados em dados organizados, rastreáveis e consumíveis por uma interface web. A autoria de Lucas é declarada no README. O projeto é independente e não é um serviço oficial do TSE.

**Arquitetura demonstrável:** fonte pública → collector Python → parsing e ingestão em batches → PostgreSQL → exportação JSON → publicação de bundles → HTML/CSS/JavaScript. Há migrations, módulos de checkpoints, observabilidade de processamento, scripts de publicação e testes. O frontend consulta um arquivo de versão antes de recarregar os dados.

**Stack confirmada:** Python, PostgreSQL, psycopg, Requests, pytest, Docker Compose, systemd, Bash, HTML, CSS, JavaScript e GitHub Actions.

**Evidências:** [README](https://github.com/lucasgonella/election-results-platform/blob/2599eae56ab3d016ca5c72cc757102c42afe6e0b/README.md), [collector](https://github.com/lucasgonella/election-results-platform/tree/2599eae56ab3d016ca5c72cc757102c42afe6e0b/collector/src), [migrations](https://github.com/lucasgonella/election-results-platform/tree/2599eae56ab3d016ca5c72cc757102c42afe6e0b/database/migrations), [testes](https://github.com/lucasgonella/election-results-platform/tree/2599eae56ab3d016ca5c72cc757102c42afe6e0b/tests).

**Showcase visual:** fluxo de dados em quatro etapas — coleta, persistência, preparação e publicação. Identificar a animação como representação demonstrativa da arquitetura; não apresentar percentuais, contadores ou métricas inventadas como resultados reais.

### Verificação da demonstração pública

- [Página pública](https://afgnet.com.br/eleicoes/): HTTPS 200, HTML com 11.392 bytes; título contendo “Resultados das Eleições 2026”.
- CSS, página de composição e dois scripts referenciados pela página: HTTPS 200. São servidos por um diretório de releases versionadas.
- [Arquivo de versão](https://afgnet.com.br/data/version.json): HTTPS 200; `generated_at` observado `2026-10-09T16:27:48.601711+00:00`.
- [Manifesto público](https://afgnet.com.br/data/manifest.json): HTTPS 200; `generated_at` observado `2026-10-09T15:07:00.549118+00:00`.
- O acesso automatizado da ferramenta web falhou, mas a requisição HTTPS externa por Python confirmou página, assets e JSONs.

**Limite da conclusão:** a demonstração está disponível e a automação consta do código. A verificação não comprova coleta continuamente atualizada naquele instante nem todas as funcionalidades da interface. Não anunciar dados atuais, SLA ou operação em tempo real. Nenhuma preferência eleitoral ou conteúdo dos resultados precisa ser reproduzido no portfólio.

## 02 — Gonella HomeLab / Ansible

**Texto PT:** Um laboratório pessoal para transformar operação em código. Roles Ansible padronizam Linux, configuram agentes Zabbix, administram tarefas do host Proxmox e sincronizam registros DNS, com revisão e execução controlada.

**Texto EN:** A personal lab for turning operations into code. Ansible roles standardize Linux, configure Zabbix agents, manage Proxmox host tasks and synchronize DNS records through controlled changes.

**Problema abordado:** manter configurações reproduzíveis, versionadas e auditáveis, praticar convergência e recuperar o estado desejado após alterações manuais.

**Implementado:** baseline Linux com APT, ferramentas administrativas, timezone e SSH; Zabbix Agent 2; nó de controle Ansible; validação do host Proxmox e gerenciamento de backup de configuração via script/service/timer; role de DNS Pi-hole com comparação, sincronização e validação de registros. O playbook atual inclui a role DNS, embora trechos do README ainda descrevam um escopo anterior.

**Stack confirmada:** Ansible, YAML, Linux, Proxmox VE, Zabbix Agent 2, Pi-hole, SSH, Python e systemd. A licença pública é MIT.

**Evidências:** [README](https://github.com/lucasgonella/homelab-ansible/blob/77f315bf8723ceab59a3d7fb6502a5936a02a527/README.md), [playbook principal](https://github.com/lucasgonella/homelab-ansible/blob/77f315bf8723ceab59a3d7fb6502a5936a02a527/playbooks/site.yml), [roles](https://github.com/lucasgonella/homelab-ansible/tree/77f315bf8723ceab59a3d7fb6502a5936a02a527/roles), [estratégia de backup](https://github.com/lucasgonella/homelab-ansible/blob/77f315bf8723ceab59a3d7fb6502a5936a02a527/docs/backup-strategy.md).

**Showcase visual:** topologia conceitual com virtualização, workloads, DNS, agentes e controle Ansible. Usar rótulos genéricos para os nós e conexões ilustrativas. Não reproduzir o inventário real, identificadores de guests, nomes internos, endereços ou cronogramas operacionais.

**Limites:** o código não automatiza integralmente rede, storage ou cluster Proxmox. Proxmox Backup Server e a validação completa de restauração são estado-alvo documentado, não conclusão operacional. Templates, triggers, dashboards e alertas do servidor Zabbix não são gerenciados como código neste repositório. A convergência e o teste de drift são relatos do autor no README, não testes repetidos nesta pesquisa.

## 03 — DevOps SRE Lab

**Texto PT:** Laboratório de entrega de uma API FastAPI em container. Testes, smoke test e publicação no GHCR produzem um artefato identificado pelo commit; o fluxo de deploy inclui health checks, readiness, retry e lógica de rollback.

**Texto EN:** A delivery lab for a containerized FastAPI service. Tests, smoke testing and GHCR publishing produce a commit-addressed artifact; the deployment flow includes health checks, readiness checks, retries and rollback logic.

**Problema abordado:** entregar e validar o mesmo artefato desde a integração contínua até a execução em Linux, com recuperação prevista quando uma validação falha.

**Arquitetura demonstrável:** PR/push → pytest e validações de Bash/Compose → build Docker → smoke test → GHCR com SHA → workflow de deploy → Docker Compose → health/readiness → aprovação ou rollback. Há separação entre runner e servidor de aplicação, documentada em termos de menor privilégio.

**Stack confirmada:** Python, FastAPI, pytest, Docker, Docker Compose, Bash, GitHub Actions, GHCR e Linux. São encontrados `/health` e `/ready` no código e funções de espera/rollback no script.

**Evidências:** [README](https://github.com/lucasgonella/devops-sre-lab/blob/4576d538f9cd46bd531d79c0caaae828c9b85b22/README.md), [CI](https://github.com/lucasgonella/devops-sre-lab/blob/4576d538f9cd46bd531d79c0caaae828c9b85b22/.github/workflows/tests.yml), [CD](https://github.com/lucasgonella/devops-sre-lab/blob/4576d538f9cd46bd531d79c0caaae828c9b85b22/.github/workflows/deploy.yml), [script de deploy](https://github.com/lucasgonella/devops-sre-lab/blob/4576d538f9cd46bd531d79c0caaae828c9b85b22/scripts/deploy.sh).

**Execuções públicas observadas:** [Tests do commit examinado](https://github.com/lucasgonella/devops-sre-lab/actions/runs/34052186634) terminou com `success`; o [Deploy mais recente](https://github.com/lucasgonella/devops-sre-lab/actions/runs/34052227957) terminou com `failure`. O README relata um primeiro CD anterior bem-sucedido. Não indicar status operacional verde nem declarar que a execução mais recente publicou com sucesso.

**Showcase visual:** etapas de entrega conectadas, com mudança de artefato por SHA e ramificação de rollback. Marcar toda animação como simulação de fluxo. Não chamar endpoints internos.

**Limites:** PostgreSQL, métricas Prometheus/Grafana, SLIs/SLOs, Terraform e Kubernetes aparecem no roadmap desse laboratório. O teste real de rollback entre duas versões distintas ainda é próximo marco no README.

## 04 — Terraform / AWS

**Texto PT:** Estudos práticos de infraestrutura como código na AWS. VPC, subnets, rotas, security groups e EC2 são declarados em HCL, com separação de estado e consumo de outputs entre camadas.

**Texto EN:** Practical infrastructure-as-code studies on AWS. VPCs, subnets, routes, security groups and EC2 are declared in HCL, with separate state and outputs connecting infrastructure layers.

**Problema abordado:** representar provisionamento e dependências de infraestrutura em arquivos versionados, em vez de configurar cada recurso manualmente.

**Implementado no código:** recursos `aws_vpc`, `aws_subnet`, `aws_internet_gateway`, `aws_route_table`, `aws_route_table_association` e `aws_security_group`; uma camada EC2 com `aws_instance` e `aws_key_pair`; backend S3 e `terraform_remote_state`; criação de bucket com versionamento. Há exemplos introdutórios de S3 em diretórios separados.

**Stack confirmada:** Terraform, HCL, AWS VPC, EC2 e S3.

**Evidências:** [rede AWS](https://github.com/lucasgonella/Terraform/blob/e5bbe9bc9bcc1107a322a13da08b6c48f80a9ede/AWS-VPC/network.tf), [backend da rede](https://github.com/lucasgonella/Terraform/blob/e5bbe9bc9bcc1107a322a13da08b6c48f80a9ede/AWS-VPC/main.tf), [EC2](https://github.com/lucasgonella/Terraform/blob/e5bbe9bc9bcc1107a322a13da08b6c48f80a9ede/AWS-EC2-COM-VPC-REMOTE-STATE/ec2.tf), [consumo de estado remoto](https://github.com/lucasgonella/Terraform/blob/e5bbe9bc9bcc1107a322a13da08b6c48f80a9ede/AWS-EC2-COM-VPC-REMOTE-STATE/main.tf), [bucket de estado](https://github.com/lucasgonella/Terraform/blob/e5bbe9bc9bcc1107a322a13da08b6c48f80a9ede/Remote-State/bucket.tf).

**Showcase visual:** HCL → grafo de dependências → rede → compute, com indicação de simulação de provisionamento. Valores de rede, contas, chaves, buckets e saídas reais não devem ser reproduzidos.

**Limites:** não há README geral substancial nem demonstração pública operacional verificada. Apresentar como estudos/laboratórios. Não afirmar ambiente AWS atualmente provisionado, conformidade, disponibilidade ou economia. Não incorporar arquivos `plan.out` ou qualquer estado Terraform ao portfólio.

## 05 — Prometheus / Grafana

**Texto PT:** Um laboratório de observabilidade para estudar métricas de aplicações em containers. Spring Boot expõe métricas por Actuator/Micrometer, Prometheus coleta séries e regras, e Grafana/Alertmanager compõem a camada de visualização e alertas.

**Texto EN:** An observability lab for studying metrics from containerized applications. Spring Boot exposes Actuator/Micrometer metrics, Prometheus collects time series and evaluates rules, and Grafana/Alertmanager provide visualization and alert routing.

**Problema abordado:** observar o comportamento de uma aplicação e investigar disponibilidade e erros por séries temporais e regras, em um ambiente local de estudo.

**Arquitetura verificável:** Docker Compose reúne aplicação Java/Spring, MySQL, Redis, Nginx, Prometheus, Grafana e cliente de teste. O `pom.xml` declara Actuator e Micrometer Prometheus. Há configuração de scrape, regras que usam `http_server_requests_seconds_count`/`rate` e configuração Alertmanager.

**Stack confirmada:** Java, Spring Boot, Actuator, Micrometer, Docker Compose, Prometheus, Grafana, Alertmanager, MySQL, Redis e Nginx.

**Evidências:** [Compose](https://github.com/lucasgonella/prometheus-grafana/blob/be816b704ce0a06d2e5220f171e202abecf067ba/docker-compose.yaml), [dependências](https://github.com/lucasgonella/prometheus-grafana/blob/be816b704ce0a06d2e5220f171e202abecf067ba/app/pom.xml), [scrape](https://github.com/lucasgonella/prometheus-grafana/blob/be816b704ce0a06d2e5220f171e202abecf067ba/prometheus/prometheus.yml), [regras](https://github.com/lucasgonella/prometheus-grafana/blob/be816b704ce0a06d2e5220f171e202abecf067ba/prometheus/alert.rules).

**Showcase visual:** gráfico próprio e uma regra ilustrativa respondendo a dados sintetizados localmente. Rótulo permanente: “Visualização demonstrativa · dados simulados” / “Demonstration · simulated data”. Sem percentuais reais de uptime ou latência atribuídos a Lucas.

**Limites:** projeto de estudos antigo, sem README geral e sem demo pública verificada. O pacote da aplicação indica material de curso; não atribuir a Lucas autoria original de toda a aplicação Java. Não copiar runtime Grafana/Prometheus, bancos, séries históricas, arquivos compilados nem conteúdo de integrações de alerta. A seleção demonstra composição e estudo de observabilidade, não operação atual em produção.

## Repositórios avaliados que ficam como referências secundárias

| Repositório | Evidência pública | Decisão |
| --- | --- | --- |
| [projeto-zabbix](https://github.com/lucasgonella/projeto-zabbix) | Scripts Python com Requests/JSON/CSV e métodos Zabbix `host.get`, `hostgroup.get`, `item.get`, `history.get`, `service.get`, `sla.get` e `sla.getsli`; commit de 2025-10-31. | Bom link secundário para automação/API e SLI. README contém apenas título; não divulgar endpoints, IDs, conteúdo de configurações ou dados exportados. |
| [Descomplicando_Kubernetes](https://github.com/lucasgonella/Descomplicando_Kubernetes) | Manifests kind, pods, limites, emptyDir, deployment/rollback, probes, ReplicaSet, DaemonSet/node exporter, PV/PVC e storage class; commit de 2026-02-08. | Referência adequada para um nó “Kubernetes · estudos” do Explorer. Não afirmar cluster de produção. |
| [kubernetes](https://github.com/lucasgonella/kubernetes) | Manifests de pods, Services, ConfigMaps, Deployments e ReplicaSets para exercício de aplicação de notícias; commit de 2023-09-12. | Sobreposição com laboratório Kubernetes mais recente. Sem destaque principal. |
| [automate-os](https://github.com/lucasgonella/automate-os) | Três scripts Shell de instalação/configuração do sistema; commit de 2021-10-29; sem README. | Registro da trajetória de automação, com escopo menor. Sem destaque principal. |

## Infrastructure Explorer: conteúdo verificável e topologia conceitual

**Aviso obrigatório PT:** “Topologia conceitual baseada em projetos públicos. As conexões ilustram responsabilidades de engenharia e não reproduzem a rede real do laboratório.”

**Aviso obrigatório EN:** “A conceptual topology based on public projects. Connections illustrate engineering responsibilities and do not reproduce the lab's real network.”

| Nó | Explicação PT | Explicação EN | Destino público |
| --- | --- | --- | --- |
| Virtualização / Proxmox | O hypervisor organiza workloads do laboratório; Ansible gerencia tarefas específicas do host. | The hypervisor organizes lab workloads; Ansible manages specific host tasks. | `homelab-ansible` |
| Sistemas / Linux | Baselines declarativos mantêm pacotes, timezone, SSH e agentes consistentes. | Declarative baselines keep packages, time zones, SSH and agents consistent. | `homelab-ansible` |
| Rede / DNS + VPC | DNS local e recursos de rede AWS são exemplos distintos de configuração declarativa. | Local DNS and AWS network resources are separate examples of declarative configuration. | `homelab-ansible`, `Terraform` |
| Automação / Ansible + Terraform | Configuração de hosts e provisionamento de recursos exercitam formas complementares de infraestrutura como código. | Host configuration and resource provisioning exercise complementary forms of infrastructure as code. | `homelab-ansible`, `Terraform` |
| Containers / Docker | O laboratório de entrega empacota e valida uma API em container. | The delivery lab packages and validates a containerized API. | `devops-sre-lab` |
| Observabilidade / Métricas | Prometheus/Grafana compõem o laboratório de métricas; Zabbix Agent 2 integra o laboratório Ansible. | Prometheus/Grafana form the metrics lab; Zabbix Agent 2 integrates with the Ansible lab. | `prometheus-grafana`, `homelab-ansible` |
| Serviços / Dados públicos | Python e PostgreSQL organizam a coleta e os snapshots que abastecem uma interface estática. | Python and PostgreSQL organize collection and snapshots powering a static interface. | `election-results-platform` |
| Entrega / CI/CD | Testes, registry e validações operacionais conectam o código ao deploy de um artefato identificado pelo commit. | Tests, a registry and operational checks connect source code to a commit-addressed deployment artifact. | `devops-sre-lab` |
| Kubernetes / Estudos | Manifests exploram probes, rollout, DaemonSets e persistência. | Manifests explore probes, rollouts, DaemonSets and persistence. | `Descomplicando_Kubernetes` (referência secundária) |

Os nós devem ser acionáveis por mouse, toque e teclado, com texto acessível equivalente ao 3D. As conexões nunca devem sugerir que Terraform, Kubernetes ou a plataforma eleitoral estejam efetivamente executando no mesmo ambiente físico. O Explorer não consulta infraestrutura nem APIs internas.

## Perfil, contato e trajetória

- Nome e posicionamento: Lucas Gonella; perfil público se apresenta como Senior System Administrator · Cloud · DevOps · SRE. [README do perfil](https://github.com/lucasgonella/lucasgonella/blob/main/README.md).
- GitHub confirmado: [github.com/lucasgonella](https://github.com/lucasgonella).
- LinkedIn confirmado como link publicado pelo próprio autor no perfil GitHub, README e rodapé da demo: [linkedin.com/in/lucasgonella](https://www.linkedin.com/in/lucasgonella/). O LinkedIn respondeu 999 ao cliente automatizado, por isso não foram inferidos cargos ou datas a partir dele.
- E-mail publicado no link `mailto` do README público: [goonella@hotmail.com](mailto:goonella@hotmail.com). Esta grafia com dois “o” é a verificada; não corrigir por suposição.
- A formação em Ciência da Computação, concluída em 2021, foi fornecida pelo usuário. Não foi encontrado comprovante público adicional nesta pesquisa.
- A progressão suporte → cloud/administração de sistemas → infraestrutura crítica e automação foi fornecida pelo usuário. Representar fases sem inventar anos, duração, empregadores ou datas de cargos.
- O perfil GitHub exibe uma afiliação de empresa, mas não fornece informações suficientes para construir uma timeline de emprego com cargo e datas. Nenhuma certificação profissional foi confirmada nas fontes examinadas.

## Atualização dos dados para o build

Usar uma lista editorial fixa dos cinco repositórios e consultar metadados públicos durante o build ou por comando manual. Gerar um snapshot local com nome, URL, branch, atividade, SHA e instante da consulta. Textos e claims de arquitetura continuam revisados editorialmente; não substituir por descrições automáticas de repositórios.

O navegador deve consumir apenas o snapshot do build. Não efetuar chamadas ilimitadas à API GitHub, não usar segredo no bundle e não incorporar inventários, estados, planos, arquivos de ambiente ou dados de runtime desses repositórios. Se a API falhar ou limitar requisições, manter o último snapshot conhecido e registrar a atualização incompleta.
