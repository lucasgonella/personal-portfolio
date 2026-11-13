import { useState } from 'react'
import { nodes } from '../content'
import { projects } from '../projects'
import SceneHost from '../SceneHost'
import { Arrow, Glyph } from '../visuals'
import { content, type Locale } from '../content'
import { Label } from './ui'

export default function InfrastructureExplorer({ locale, onExpand }: { locale: Locale; onExpand: (repo: string) => void }) {
  const c = content[locale]
  const [selected, setSelected] = useState(0)
  const node = nodes[selected]
  const nodeProject = projects.find(project => project.repo === node.project)!
  return (
    <section className="explorer section-shell" id="explorer" aria-labelledby="explorer-title">
      <Label number="04">INFRASTRUCTURE EXPLORER</Label>
      <div className="section-heading">
        <h2 id="explorer-title" data-reveal>{c.explorerTitle}</h2>
        <p data-reveal>{c.explorerText}</p>
      </div>
      <div className="explorer-console" data-reveal>
        <div className="console-topbar">
          <span>
            <i className="tiny-square" /> GONELLA / SYSTEM MAP</span>
          <span>{locale === 'pt' ? 'TOPOLOGIA CONCEITUAL' : 'CONCEPTUAL TOPOLOGY'} <i className="tiny-square hollow" />
          </span>
        </div>
        <div className="explorer-body">
          <div className="explorer-map">
            <SceneHost mode="explorer" locale={locale} selected={selected} onSelect={setSelected} />
            <div className="map-hint">
              <span>{c.explorerHint}</span>
              <span>{c.drag}</span>
            </div>
          </div>
          <div className="node-panel" aria-live="polite" aria-atomic="true">
            <div className="node-topline">
              <span>{c.node} / {String(selected + 1).padStart(2, '0')}</span>
              <Glyph type={selected} />
            </div>
            <h3>{node.label[locale]}</h3>
            <div className="node-tools mono">{node.tools}</div>
            <p>{node.text[locale]}</p>
            <div className="node-project">
              <span>{c.related}</span>
              <a href={`#project-${node.project}`} onClick={() => onExpand(node.project)}>{nodeProject.copy[locale].title}<Arrow diagonal />
              </a>
            </div>
            <div className="node-fingerprint" aria-hidden="true">{Array.from({ length: 30 }, (_, i) =>
              <i key={i} style={{ height: `${12 + (i * 17 % 31)}px` }} />)}</div>
          </div>
        </div>
        <div className="node-selector" role="group" aria-label={c.explorerHint}>{nodes.map((n, i) =>
          <button key={n.id} aria-pressed={selected === i} className={selected === i ? 'selected' : ''} onClick={() => setSelected(i)}>
            <span>{String(i + 1).padStart(2, '0')}</span>{n.label[locale]}</button>)}</div>
      </div>
      <p className="section-note">↳ {c.explorerNote}</p>
    </section>
  )
}
