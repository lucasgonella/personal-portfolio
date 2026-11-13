import { content, links, type Locale } from '../content'
import { engineering } from '../engineering'
import { projectMetadata, type Project } from '../projects'
import { Arrow, ProjectVisual } from '../visuals'
import { External, SourceLink } from './ui'

type Props = { project: Project; locale: Locale; isOpen: boolean; onExpand: (repo: string | null) => void }

export default function ProjectCard({ project, locale, isOpen, onExpand }: Props) {
  const c = content[locale]
  const text = project.copy[locale]
  const evidence = engineering[project.repo][locale]
  const meta = projectMetadata(project.repo)
  const en = locale === 'en'

  return (
    <article id={`project-${project.repo}`} className={`project-card project-${project.visual} ${isOpen ? 'project-expanded' : ''}`} data-reveal>
      <div className="project-image">
        <ProjectVisual project={project} locale={locale} />
        <span className="illustrative-label">{c.illustrative}</span>
      </div>
      <div className="project-content">
        <div className="project-eyebrow">
          <span>{text.category}</span>
          <span>{project.number} / 05</span>
        </div>
        <div className="project-kind">
          <i aria-hidden="true" />{evidence.kind}</div>
        <h3>{text.title}</h3>
        <p>{text.description}</p>
        <div className="tech-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
        <div className="project-evidence">
          <span className="mono">{en ? 'ENGINEERING DECISION' : 'DECISÃO DE ENGENHARIA'}</span>
          <p>{evidence.decision}</p>
          <SourceLink href={evidence.source}>{evidence.sourceLabel}</SourceLink>
        </div>
        <div className="project-links">
          <button className="text-link detail-trigger" aria-expanded={isOpen} aria-controls={`details-${project.repo}`} onClick={() => onExpand(isOpen ? null : project.repo)}>
            {isOpen ? c.less : c.details}<span aria-hidden="true">{isOpen ? '−' : '+'}</span>
          </button>
          <External className="repo-link" href={meta?.url ?? `${links.github}/${project.repo}`}>{c.repo}<Arrow diagonal />
          </External>
        </div>
        {project.demo && <External className="demo-link" href={project.demo}>{c.demo}<Arrow diagonal />
        </External>}
        <div className="project-details" id={`details-${project.repo}`} hidden={!isOpen}>
          <dl>
            <dt>{c.problem}</dt>
            <dd>{text.problem}</dd>
            <dt>{c.implementation}</dt>
            <dd>{text.architecture}</dd>
            <dt>{en ? 'Engineering decision' : 'Decisão de engenharia'}</dt>
            <dd>{evidence.decision}</dd>
            <dt>{en ? 'How to examine the work' : 'Como verificar o trabalho'}</dt>
            <dd>{evidence.validation}</dd>
            <dt>{en ? 'Engineering takeaway' : 'Aprendizado de engenharia'}</dt>
            <dd>{evidence.takeaway}</dd>
            <dt>{c.scope}</dt>
            <dd>{text.scope}</dd>
          </dl>
          {meta?.lastCommitAt && <div className="project-date">{c.updated}: <time dateTime={meta.lastCommitAt}>{new Date(meta.lastCommitAt).toLocaleDateString(en ? 'en-GB' : 'pt-BR', { timeZone: 'UTC' })}</time>{meta.fork && <span> · Fork</span>}</div>}
        </div>
      </div>
    </article>
  )
}
