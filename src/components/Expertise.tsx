import { useState } from 'react'
import { stack } from '../content'
import { Arrow, Glyph } from '../visuals'
import { content, type Locale } from '../content'
import { Label } from './ui'

export default function Expertise({ locale, interactive, onExpand }: { locale: Locale; interactive: boolean; onExpand: (repo: string) => void }) {
  const c = content[locale]
  const [stackSelected, setStackSelected] = useState(0)
  return (
    <section id="expertise" className="stack-section section-shell" aria-labelledby="stack-title">
      <Label number="02">{c.stackLabel}</Label>
      <div className="section-heading">
        <h2 id="stack-title" data-reveal>{c.stackTitle}<br />
          <span>{c.stackTitle2}</span>
        </h2>
        <p data-reveal>{c.stackText}</p>
      </div>
      <div className="stack-grid" role="group" aria-label={locale === 'pt' ? 'Áreas de tecnologia' : 'Technology areas'}>{stack.map((technologies, i) =>
        <button disabled={!interactive} className={`stack-card ${stackSelected === i ? 'selected' : ''}`} key={i} onClick={() => setStackSelected(i)} aria-pressed={stackSelected === i}>
          <div className="stack-card-top">
            <Glyph type={i} />
            <span className="mono">0{i + 1}</span>
          </div>
          <h3>{c.stackCategories[i]}</h3>
          <div>{technologies.map(tech =>
            <span key={tech}>{tech}</span>)}</div>
          <Arrow diagonal />
        </button>)}</div>
      <div className="stack-context" aria-live="polite">
        <span className="mono">↳ {c.stackCategories[stackSelected]}</span>
        <p>{c.stackDescriptions[stackSelected]}</p>
      </div>
      <div className="practice-overview">
        <p className="mono practice-label">{c.practiceLabel}</p>
        <div className="practice-grid">{c.practices.map((practice, i) =>
          <a key={practice.repo} href={`#project-${practice.repo}`} onClick={() => onExpand(practice.repo)}>
            <span className="mono practice-number">0{i + 1} /</span>
            <h3>{practice.title}</h3>
            <p>{practice.text}</p>
            <span className="text-link">{practice.link}<Arrow diagonal />
            </span>
          </a>)}</div>
      </div>
    </section>
  )
}
