import { projects, verifiedAt } from '../projects'
import { links } from '../content'
import { Arrow } from '../visuals'
import { External } from './ui'
import ProjectCard from './ProjectCard'
import { content, type Locale } from '../content'
import { Label } from './ui'

export default function EngineeringProjects({ locale, expanded, onExpand }: { locale: Locale; expanded: string | null; onExpand: (repo: string | null) => void }) {
  const c = content[locale]
  return (
    <section className="works section-shell" id="projects" aria-labelledby="projects-title">
      <Label number="03">{c.worksLabel}</Label>
      <div className="section-heading">
        <h2 id="projects-title" data-reveal>{c.worksTitle}<br />
          <span>{c.worksTitle2}</span>
        </h2>
        <p data-reveal>{c.worksText}</p>
      </div>
      <div className="project-grid">{projects.map(project =>
        <ProjectCard key={project.repo} project={project} locale={locale} isOpen={expanded === project.repo} onExpand={onExpand} />)}</div>
      <div className="works-bottom">
        <span>{c.snapshot} <time dateTime={verifiedAt}>{new Date(verifiedAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-GB', { timeZone: 'UTC' })}</time>
        </span>
        <External className="text-link" href={links.github}>{c.allRepos}<Arrow diagonal />
        </External>
      </div>
    </section>
  )
}
