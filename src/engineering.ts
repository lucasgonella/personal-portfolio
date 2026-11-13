import type { Locale } from './content'

type Evidence = {
  kind: string
  decision: string
  validation: string
  takeaway: string
  source: string
  sourceLabel: string
}

export const engineering: Record<string, Record<Locale, Evidence>> = {
  'devops-sre-lab': {
    pt: {
      kind: 'Laboratório DevOps / SRE',
      decision: 'Promover a imagem aprovada pelo CI pelo SHA, separando runner e execução da aplicação.',
      validation: 'Pytest, smoke test do container e verificações de /health e /ready documentados.',
      takeaway: 'Uma entrega precisa ser verificável e recuperável.',
      source: 'https://github.com/lucasgonella/devops-sre-lab#readme', sourceLabel: 'Arquitetura e operação',
    },
    en: {
      kind: 'DevOps / SRE lab',
      decision: 'Promote the CI-approved image by commit SHA, separating the runner from application execution.',
      validation: 'Documented Pytest coverage, container smoke tests and /health and /ready checks.',
      takeaway: 'A delivery process should be verifiable and recoverable.',
      source: 'https://github.com/lucasgonella/devops-sre-lab#readme', sourceLabel: 'Architecture and operations',
    },
  },
  'homelab-ansible': {
    pt: {
      kind: 'Laboratório pessoal',
      decision: 'Organizar configuração por roles e grupos de hosts, preservando as diferenças entre Linux e hypervisor.',
      validation: 'Convergência idempotente descrita no README; inventário e playbooks disponíveis para revisão.',
      takeaway: 'Configuração reproduzível é também documentação operacional.',
      source: 'https://github.com/lucasgonella/homelab-ansible#readme', sourceLabel: 'Roles e escopo do laboratório',
    },
    en: {
      kind: 'Personal infrastructure lab',
      decision: 'Organize configuration by roles and host groups, keeping Linux and hypervisor requirements distinct.',
      validation: 'The README documents idempotent convergence; inventory and playbooks are available for review.',
      takeaway: 'Repeatable configuration is also operational documentation.',
      source: 'https://github.com/lucasgonella/homelab-ansible#readme', sourceLabel: 'Roles and lab scope',
    },
  },
  'election-results-platform': {
    pt: {
      kind: 'Projeto independente / dados públicos',
      decision: 'Separar ingestão e persistência da publicação de um bundle estático, com staging e validação.',
      validation: 'CI com Pytest e publicação documentada com backups e verificação HTTPS por SHA-256.',
      takeaway: 'A confiabilidade depende do caminho inteiro, da fonte à publicação.',
      source: 'https://github.com/lucasgonella/election-results-platform#readme', sourceLabel: 'Pipeline e publicação',
    },
    en: {
      kind: 'Independent project / public data',
      decision: 'Separate ingestion and persistence from static-bundle publication, with staging and validation.',
      validation: 'Pytest CI and a documented publishing process with backups and HTTPS SHA-256 verification.',
      takeaway: 'Reliability depends on the whole path, from source to publication.',
      source: 'https://github.com/lucasgonella/election-results-platform#readme', sourceLabel: 'Pipeline and publishing',
    },
  },
  'prometheus-grafana': {
    pt: {
      kind: 'Estudo de observabilidade',
      decision: 'Separar instrumentação, coleta, visualização e alertas em serviços de uma stack Compose.',
      validation: 'Configuração pública de serviços, coleta e alertas; execução atual e SLOs não são presumidos.',
      takeaway: 'Métricas fazem sentido quando ajudam a investigar o sistema.',
      source: 'https://github.com/lucasgonella/prometheus-grafana/blob/main/docker-compose.yaml', sourceLabel: 'Configuração da stack',
    },
    en: {
      kind: 'Observability study',
      decision: 'Separate instrumentation, collection, visualization and alerting into Compose services.',
      validation: 'Public service, collection and alert configuration; no claim of current uptime or SLOs.',
      takeaway: 'Metrics matter when they help explain system behavior.',
      source: 'https://github.com/lucasgonella/prometheus-grafana/blob/main/docker-compose.yaml', sourceLabel: 'Stack configuration',
    },
  },
  Terraform: {
    pt: {
      kind: 'Estudo de infraestrutura como código',
      decision: 'Representar rede e compute em HCL, com exemplos de separação de estado remoto.',
      validation: 'Código disponível para revisão. Este portfólio não comprova aplicação atual em uma conta cloud.',
      takeaway: 'Antes de aplicar, entender dependências e revisar o plano.',
      source: 'https://github.com/lucasgonella/Terraform/tree/main/AWS-EC2-COM-VPC-REMOTE-STATE', sourceLabel: 'Exemplo de rede e estado',
    },
    en: {
      kind: 'Infrastructure-as-code study',
      decision: 'Describe networking and compute in HCL, with examples that separate remote state.',
      validation: 'Code is available for review. This portfolio does not verify a current cloud deployment.',
      takeaway: 'Understand dependencies and review the plan before applying it.',
      source: 'https://github.com/lucasgonella/Terraform/tree/main/AWS-EC2-COM-VPC-REMOTE-STATE', sourceLabel: 'Networking and state example',
    },
  },
}
