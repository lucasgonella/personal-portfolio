import { useEffect, useRef, useState } from 'react'
import { content, englishPath, links, type Locale } from './content'
import { verifiedAt } from './projects'
import { Arrow } from './visuals'
import { External, Label } from './components/ui'
import Hero from './components/Hero'
import { usePortfolioMotion } from './usePortfolioMotion'
import Profile from './components/Profile'
import Expertise from './components/Expertise'
import EngineeringProjects from './components/EngineeringProjects'
import InfrastructureExplorer from './components/InfrastructureExplorer'

const anchors = ['about', 'expertise', 'projects', 'explorer', 'contact']

export default function App({ locale = 'pt' }: { locale?: Locale }) {
  const c = content[locale]
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState('')
  const [interactive, setInteractive] = useState(false)
  const main = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => { setInteractive(true) }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) })
    }, { rootMargin: '-20% 0px -55% 0px' })
    anchors.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const listener = (e: KeyboardEvent) => { if (e.key === 'Escape' && menu) { setMenu(false); menuButton.current?.focus() } }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [menu])
  usePortfolioMotion(main)

  async function copyEmail() {
    try { await navigator.clipboard.writeText(links.email); setCopyStatus(c.copied) } catch { setCopyStatus(c.copyFailed) }
    setTimeout(() => setCopyStatus(''), 4000)
  }

  return <>
    <a className="skip-link" href="#main">{c.skip}</a>
    <header className="site-header">
      <a className="wordmark" href={locale === 'pt' ? '/' : englishPath} aria-label="Gonella — Home">
        <svg viewBox="0 0 28 28" width="25" height="25" fill="none" aria-hidden="true">
          <path d="M21 5H6v18h15V13H13" stroke="currentColor" strokeWidth="2" />
        </svg>GONELLA<span className="wordmark-dot">✳</span>
      </a>
      <nav id="primary-nav" className={`nav ${menu ? 'nav-open' : ''}`} aria-label={locale === 'pt' ? 'Navegação principal' : 'Primary navigation'}>
        {anchors.map((id, i) =>
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => setMenu(false)}>{c.nav[i]}</a>)}
      </nav>
      <div className="header-actions">
        <div className="language-switch" aria-label={locale === 'pt' ? 'Idioma' : 'Language'}>
          <a href="/" hrefLang="pt-BR" lang="pt-BR" className={locale === 'pt' ? 'selected' : ''} aria-current={locale === 'pt' ? 'page' : undefined}>PT</a>
          <span>/</span>
          <a href={englishPath} hrefLang="en" lang="en" className={locale === 'en' ? 'selected' : ''} aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
        </div>
        <External className="header-github" href={links.github}>GitHub <Arrow diagonal />
        </External>
        <button ref={menuButton} className="menu-button" aria-label={menu ? c.close : c.menu} aria-expanded={menu} aria-controls="primary-nav" onClick={() => setMenu(!menu)}>
          <span />
          <span />
        </button>
      </div>
    </header>
    <main id="main" ref={main} tabIndex={-1}>
      <Hero locale={locale} interactive={interactive} />
      <div className="proof-band">{c.proof.map(item =>
        <div key={item.label}>
          <span className="mono">{item.label}</span>
          <strong>{item.title}</strong>
          <p>{item.text}</p>
        </div>)}</div>
      <Profile locale={locale} interactive={interactive} />
      <Expertise locale={locale} interactive={interactive} onExpand={setExpanded} />
      <EngineeringProjects locale={locale} expanded={expanded} onExpand={setExpanded} />
      <InfrastructureExplorer locale={locale} onExpand={setExpanded} />





      <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
        <Label number="05">{c.contactLabel}</Label>
        <div className="contact-content">
          <h2 id="contact-title" data-reveal>{c.contactTitle}<br />
            <span>{c.contactTitle2}</span>
          </h2>
          <p data-reveal>{c.contactText}</p>
          <div className="contact-ctas">
            <a className="button button-primary" href={`mailto:${links.email}`}>{c.email}<Arrow diagonal />
            </a>
            <button className="copy-button" onClick={copyEmail} aria-label={c.copyEmail}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" />
                <path d="M15 5V3H3v12h2" stroke="currentColor" />
              </svg>
            </button>
            <span className="copy-status" role="status">{copyStatus}</span>
          </div>
          <div className="contact-socials">
            <External href={links.github}>GitHub<Arrow diagonal />
            </External>
            <External href={links.linkedin}>LinkedIn<Arrow diagonal />
            </External>
            <a href={`mailto:${links.email}`}>{links.email}<Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="contact-decoration" aria-hidden="true">
          <svg viewBox="0 0 300 300">
            <path d="M230 55H65v190h165V140H140" stroke="currentColor" fill="none" strokeWidth="2" />
            <path d="M245 40H50v220h195V125H125" stroke="currentColor" fill="none" strokeWidth=".5" />
          </svg>
        </div>
      </section>
    </main>
    <footer className="site-footer">
      <div className="footer-top">
        <a className="wordmark" href="#top">GONELLA<span className="wordmark-dot">✳</span>
        </a>
        <span>{c.footer}</span>
        <a className="text-link" href="#top">{c.top}↑</a>
      </div>
      <div className="footer-bottom mono">
        <span>© {new Date(verifiedAt).getUTCFullYear()} LUCAS GONELLA</span>
        <span>BUILD. AUTOMATE. OPERATE.</span>
        <span>PT / EN · {locale === 'pt' ? 'FEITO NO BRASIL' : 'MADE IN BRAZIL'}</span>
      </div>
    </footer>
  </>
}
