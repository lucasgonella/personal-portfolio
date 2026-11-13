import { useState } from 'react'
import { Glyph } from '../visuals'
import { content, type Locale } from '../content'
import { Label } from './ui'

export default function Profile({ locale, interactive }: { locale: Locale; interactive: boolean }) {
  const c = content[locale]
  const [timeline, setTimeline] = useState(0)
  return (
    <section className="about section-shell" id="about" aria-labelledby="about-title">
      <Label number="01">{c.aboutLabel}</Label>
      <div className="about-grid">
        <div className="about-story">
          <h2 id="about-title" data-reveal>{c.aboutTitle}<br />
            <span>{c.aboutTitle2}</span>
          </h2>
          <p data-reveal>{c.aboutText}</p>
          <p data-reveal>{c.aboutText2}</p>
          <p className="about-lab" data-reveal>{c.aboutText3}</p>
          <div className="signature">Lucas Gonella <span>GONELLA / ENGINEERING</span>
          </div>
        </div>
        <div className="timeline" data-reveal>{c.timeline.map((item, i) =>
          <div className={`timeline-item ${timeline === i ? 'selected' : ''}`} key={item.title}>
            <button disabled={!interactive} aria-expanded={timeline === i} aria-controls={`timeline-${i}`} onClick={() => setTimeline(i)}>
              <span className="timeline-marker" />
              <span className="timeline-phase">{item.phase}</span>
              <span className="timeline-title">{item.title}</span>
              <span aria-hidden="true">{timeline === i ? '−' : '+'}</span>
            </button>
            <p id={`timeline-${i}`} hidden={timeline !== i}>{item.text}</p>
          </div>)}<div className="education-note">
            <Glyph type={3} />
            <span>{c.timeline[3].title}<small>2021 · {locale === 'pt' ? 'Graduação concluída' : 'Degree completed'}</small>
            </span>
          </div>
          <p className="timeline-note">{c.timelineNote}</p>
        </div>
      </div>
    </section>
  )
}
