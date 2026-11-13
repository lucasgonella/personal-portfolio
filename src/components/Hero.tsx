import { useState } from 'react'
import { content, type Locale } from '../content'
import { Arrow } from '../visuals'
import SceneHost from '../SceneHost'

export default function Hero({ locale, interactive }: { locale: Locale; interactive: boolean }) {
  const c = content[locale]
  const [layer, setLayer] = useState(3)
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="mono">
          <i className="tiny-square" /> LUCAS GONELLA</span>
        <span className="mono hero-coordinate">SYSTEMS THINKING / HUMAN IMPACT</span>
      </div>
      <div className="hero-content">
        <div className="hero-role">{c.role}</div>
        <h1 id="hero-title">{c.hero.map((line, i) =>
          <span key={line} className={`hero-line hero-line-${i}`}>{line}</span>)}</h1>
        <p className="hero-intro">{c.intro}</p>
        <div className="hero-goal">
          <span className="mono">{c.careerLabel}</span>
          <p>{c.careerGoal}</p>
        </div>
        <div className="hero-ctas">
          <a className="button button-primary" href="#projects">{c.projectsCta}<Arrow />
          </a>
          <a className="text-link" href="#about">{c.aboutCta}<Arrow diagonal />
          </a>
        </div>
        <a className="hero-contact" href="#contact">{c.contactCta} <span>↗</span>
        </a>
      </div>
      <div className="hero-art">
        <div className="art-orbit orbit-1" />
        <div className="art-orbit orbit-2" />
        <SceneHost mode="hero" locale={locale} selected={layer} />
        <div className="hero-layer-selector" role="group" aria-label={c.layerControls}>{c.layers.map((name, index) =>
          <button disabled={!interactive} key={name} aria-pressed={layer === index} onClick={() => setLayer(index)}>{name}</button>)}</div>
        <p className="hero-layer-note" aria-live="polite">{c.layerNotes[layer]}</p>
        <div className="core-annotation annotation-1">
          <i /> COMPUTE / 01</div>
        <div className="core-annotation annotation-2">
          <i /> AUTOMATION / 02</div>
        <div className="core-annotation annotation-3">
          <i /> OBSERVABILITY / 03</div>
        <div className="hero-art-caption">
          <span>{c.coreLabel}</span>
          <span>{c.concept}</span>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#about">
          <span className="scroll-symbol">↓</span>{c.scroll}</a>
        <span className="mono">DESIGN × ENGINEERING</span>
      </div>
    </section>
  )
}
