import { useEffect, useRef, useState } from 'react'
import { content, englishPath, links, nodes, stack, type Locale } from './content'
import { projects, projectMetadata, verifiedAt } from './projects'
import SceneHost from './SceneHost'
import { Arrow, Glyph, ProjectVisual } from './visuals'

const anchors=['explorer','projects','about','contact']
function Label({ number, children }: { number: string; children: React.ReactNode }) { return <div className="section-label"><span className="label-number">{number}</span><span>{children}</span></div> }
function External({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) { return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a> }

export default function App({ locale = 'pt' }: { locale?: Locale }) {
  const c=content[locale]
  const [menu,setMenu]=useState(false)
  const [active,setActive]=useState('')
  const [selected,setSelected]=useState(0)
  const [expanded,setExpanded]=useState<string|null>(null)
  const [timeline,setTimeline]=useState(0)
  const [stackSelected,setStackSelected]=useState(0)
  const [copyStatus,setCopyStatus]=useState('')
  const main=useRef<HTMLElement>(null)
  const menuButton=useRef<HTMLButtonElement>(null)

  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{ if(entry.isIntersecting) setActive(entry.target.id) })
    },{rootMargin:'-20% 0px -55% 0px'})
    anchors.forEach(id=>{ const el=document.getElementById(id); if(el) observer.observe(el) })
    return ()=>observer.disconnect()
  },[])
  useEffect(()=>{
    const listener=(e:KeyboardEvent)=>{ if(e.key==='Escape' && menu){setMenu(false);menuButton.current?.focus()} }
    document.addEventListener('keydown',listener)
    return ()=>document.removeEventListener('keydown',listener)
  },[menu])
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cleanup:(()=>void)|undefined
    let cancelled=false
    const timer=setTimeout(()=>{
      Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
        if(cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        const context=gsap.context(()=>{
          document.querySelectorAll('[data-reveal]').forEach(el=>{
            gsap.from(el,{y:32,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}})
          })
          gsap.to('.hero-art',{y:80,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}})
          gsap.fromTo('.story-line',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'.statement',start:'top 90%',end:'bottom 25%',scrub:true}})
        },main)
        cleanup=()=>context.revert()
      })
    },1900)
    return ()=>{cancelled=true;clearTimeout(timer);cleanup?.()}
  },[])

  async function copyEmail(){
    try{ await navigator.clipboard.writeText(links.email);setCopyStatus(c.copied) }catch{setCopyStatus(c.copyFailed)}
    setTimeout(()=>setCopyStatus(''),4000)
  }

  const node=nodes[selected]
  const nodeProject=projects.find(p=>p.repo===node.project)!
  return <>
    <a className="skip-link" href="#main">{c.skip}</a>
    <header className="site-header">
      <a className="wordmark" href={locale==='pt'?'/':englishPath} aria-label="Gonella — Home"><svg viewBox="0 0 28 28" width="25" height="25" fill="none" aria-hidden="true"><path d="M21 5H6v18h15V13H13" stroke="currentColor" strokeWidth="2"/></svg>GONELLA<span className="wordmark-dot">✳</span></a>
      <nav id="primary-nav" className={`nav ${menu?'nav-open':''}`} aria-label={locale==='pt'?'Navegação principal':'Primary navigation'}>
        {anchors.map((id,i)=><a key={id} href={`#${id}`} className={active===id?'active':''} aria-current={active===id?'location':undefined} onClick={()=>setMenu(false)}>{c.nav[i]}</a>)}
      </nav>
      <div className="header-actions"><div className="language-switch" aria-label={locale==='pt'?'Idioma':'Language'}><a href="/" hrefLang="pt-BR" lang="pt-BR" className={locale==='pt'?'selected':''} aria-current={locale==='pt'?'page':undefined}>PT</a><span>/</span><a href={englishPath} hrefLang="en" lang="en" className={locale==='en'?'selected':''} aria-current={locale==='en'?'page':undefined}>EN</a></div><External className="header-github" href={links.github}>GitHub <Arrow diagonal/></External><button ref={menuButton} className="menu-button" aria-label={menu?c.close:c.menu} aria-expanded={menu} aria-controls="primary-nav" onClick={()=>setMenu(!menu)}><span/><span/></button></div>
    </header>
    <main id="main" ref={main} tabIndex={-1}>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-topline"><span className="mono"><i className="tiny-square"/> LUCAS GONELLA</span><span className="mono hero-coordinate">SYSTEMS THINKING / HUMAN IMPACT</span></div>
        <div className="hero-content"><div className="hero-role">{c.role}</div><h1 id="hero-title">{c.hero.map((line,i)=><span key={line} className={`hero-line hero-line-${i}`}>{line}</span>)}</h1><p className="hero-intro">{c.intro}</p><div className="hero-ctas"><a className="button button-primary" href="#projects">{c.projectsCta}<Arrow/></a><a className="text-link" href="#about">{c.aboutCta}<Arrow diagonal/></a></div><a className="hero-contact" href="#contact">{c.contactCta} <span>↗</span></a></div>
        <div className="hero-art"><div className="art-orbit orbit-1"/><div className="art-orbit orbit-2"/><SceneHost mode="hero" locale={locale}/><div className="core-annotation annotation-1"><i/> COMPUTE / 01</div><div className="core-annotation annotation-2"><i/> AUTOMATION / 02</div><div className="core-annotation annotation-3"><i/> OBSERVABILITY / 03</div><div className="hero-art-caption"><span>{c.coreLabel}</span><span>{c.concept}</span></div></div>
        <div className="hero-bottom"><a href="#explorer"><span className="scroll-symbol">↓</span>{c.scroll}</a><span className="mono">DESIGN × ENGINEERING</span></div>
      </section>
      <div className="discipline-strip" aria-hidden="true">{c.disciplines.map((word,i)=><span key={word}><i>{['⌘','↗','◈'][i]}</i>{word}</span>)}</div>
      <section className="statement section-shell"><div className="statement-index mono">01 — PHILOSOPHY</div><div><h2 data-reveal>{c.statement}<br/><span>{c.statement2}</span></h2><p data-reveal>{c.statementText}</p><div className="story-line"/></div></section>
      <section className="explorer section-shell" id="explorer" aria-labelledby="explorer-title">
        <Label number="02">INFRASTRUCTURE EXPLORER</Label><div className="section-heading"><h2 id="explorer-title" data-reveal>{c.explorerTitle}</h2><p data-reveal>{c.explorerText}</p></div>
        <div className="explorer-console" data-reveal><div className="console-topbar"><span><i className="tiny-square"/> GONELLA / SYSTEM MAP</span><span>{locale==='pt'?'TOPOLOGIA CONCEITUAL':'CONCEPTUAL TOPOLOGY'} <i className="tiny-square hollow"/></span></div><div className="explorer-body"><div className="explorer-map"><SceneHost mode="explorer" locale={locale} selected={selected} onSelect={setSelected}/><div className="map-hint"><span>{c.explorerHint}</span><span>{c.drag}</span></div></div><div className="node-panel" aria-live="polite" aria-atomic="true"><div className="node-topline"><span>{c.node} / {String(selected+1).padStart(2,'0')}</span><Glyph type={selected}/></div><h3>{node.label[locale]}</h3><div className="node-tools mono">{node.tools}</div><p>{node.text[locale]}</p><div className="node-project"><span>{c.related}</span><a href={`#project-${node.project}`} onClick={()=>setExpanded(node.project)}>{nodeProject.copy[locale].title}<Arrow diagonal/></a></div><div className="node-fingerprint" aria-hidden="true">{Array.from({length:30},(_,i)=><i key={i} style={{height:`${12+(i*17%31)}px`}}/>)}</div></div></div><div className="node-selector" role="group" aria-label={c.explorerHint}>{nodes.map((n,i)=><button key={n.id} aria-pressed={selected===i} className={selected===i?'selected':''} onClick={()=>setSelected(i)}><span>{String(i+1).padStart(2,'0')}</span>{n.label[locale]}</button>)}</div></div><p className="section-note">↳ {c.explorerNote}</p>
      </section>
      <section className="works section-shell" id="projects" aria-labelledby="projects-title">
        <Label number="03">{c.worksLabel}</Label><div className="section-heading"><h2 id="projects-title" data-reveal>{c.worksTitle}<br/><span>{c.worksTitle2}</span></h2><p data-reveal>{c.worksText}</p></div>
        <div className="project-grid">{projects.map(project=>{
          const text=project.copy[locale]
          const meta=projectMetadata(project.repo)
          const isOpen=expanded===project.repo
          return <article id={`project-${project.repo}`} className={`project-card project-${project.visual} ${isOpen?'project-expanded':''}`} key={project.repo} data-reveal>
            <div className="project-image"><ProjectVisual project={project} locale={locale}/><span className="illustrative-label">{c.illustrative}</span></div>
            <div className="project-content"><div className="project-eyebrow"><span>{text.category}</span><span>{project.number} / 05</span></div><h3>{text.title}</h3><p>{text.description}</p><div className="tech-tags">{project.technologies.map(tech=><span key={tech}>{tech}</span>)}</div><div className="project-links"><button className="text-link detail-trigger" aria-expanded={isOpen} aria-controls={`details-${project.repo}`} onClick={()=>setExpanded(isOpen?null:project.repo)}>{isOpen?c.less:c.details}<span aria-hidden="true">{isOpen?'−':'+'}</span></button><External className="repo-link" href={meta?.url ?? `${links.github}/${project.repo}`}>{c.repo}<Arrow diagonal/></External></div>{project.demo&&<External className="demo-link" href={project.demo}>{c.demo}<Arrow diagonal/></External>}<div className="project-details" id={`details-${project.repo}`} hidden={!isOpen}><dl><dt>{c.problem}</dt><dd>{text.problem}</dd><dt>{c.implementation}</dt><dd>{text.architecture}</dd><dt>{c.scope}</dt><dd>{text.scope}</dd></dl>{meta?.lastCommitAt&&<div className="project-date">{c.updated}: <time dateTime={meta.lastCommitAt}>{new Date(meta.lastCommitAt).toLocaleDateString(locale==='pt'?'pt-BR':'en-GB',{timeZone:'UTC'})}</time>{meta.fork&&<span> · Fork</span>}</div>}</div></div>
          </article>
        })}</div><div className="works-bottom"><span>{c.snapshot} <time dateTime={verifiedAt}>{new Date(verifiedAt).toLocaleDateString(locale==='pt'?'pt-BR':'en-GB',{timeZone:'UTC'})}</time></span><External className="text-link" href={links.github}>{c.allRepos}<Arrow diagonal/></External></div>
      </section>
      <section className="about section-shell" id="about" aria-labelledby="about-title">
        <Label number="04">{c.aboutLabel}</Label><div className="about-grid"><div className="about-story"><h2 id="about-title" data-reveal>{c.aboutTitle}<br/><span>{c.aboutTitle2}</span></h2><p data-reveal>{c.aboutText}</p><p data-reveal>{c.aboutText2}</p><p className="about-lab" data-reveal>{c.aboutText3}</p><div className="signature">Lucas Gonella <span>GONELLA / ENGINEERING</span></div></div><div className="timeline" data-reveal>{c.timeline.map((item,i)=><div className={`timeline-item ${timeline===i?'selected':''}`} key={item.title}><button aria-expanded={timeline===i} aria-controls={`timeline-${i}`} onClick={()=>setTimeline(i)}><span className="timeline-marker"/><span className="timeline-phase">{item.phase}</span><span className="timeline-title">{item.title}</span><span aria-hidden="true">{timeline===i?'−':'+'}</span></button><p id={`timeline-${i}`} hidden={timeline!==i}>{item.text}</p></div>)}<div className="education-note"><Glyph type={3}/><span>{c.timeline[3].title}<small>2021 · {locale==='pt'?'Graduação concluída':'Degree completed'}</small></span></div><p className="timeline-note">{c.timelineNote}</p></div></div>
      </section>
      <section className="stack-section section-shell" aria-labelledby="stack-title">
        <Label number="05">{c.stackLabel}</Label><div className="section-heading"><h2 id="stack-title" data-reveal>{c.stackTitle}<br/><span>{c.stackTitle2}</span></h2><p data-reveal>{c.stackText}</p></div><div className="stack-grid" role="group" aria-label={locale==='pt'?'Áreas de tecnologia':'Technology areas'}>{stack.map((technologies,i)=><button className={`stack-card ${stackSelected===i?'selected':''}`} key={i} onClick={()=>setStackSelected(i)} aria-pressed={stackSelected===i}><div className="stack-card-top"><Glyph type={i}/><span className="mono">0{i+1}</span></div><h3>{c.stackCategories[i]}</h3><div>{technologies.map(tech=><span key={tech}>{tech}</span>)}</div><Arrow diagonal/></button>)}</div><div className="stack-context" aria-live="polite"><span className="mono">↳ {c.stackCategories[stackSelected]}</span><p>{c.stackDescriptions[stackSelected]}</p></div>
      </section>
      <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
        <Label number="06">{c.contactLabel}</Label><div className="contact-content"><h2 id="contact-title" data-reveal>{c.contactTitle}<br/><span>{c.contactTitle2}</span></h2><p data-reveal>{c.contactText}</p><div className="contact-ctas"><a className="button button-primary" href={`mailto:${links.email}`}>{c.email}<Arrow diagonal/></a><button className="copy-button" onClick={copyEmail} aria-label={c.copyEmail}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor"/><path d="M15 5V3H3v12h2" stroke="currentColor"/></svg></button><span className="copy-status" role="status">{copyStatus}</span></div><div className="contact-socials"><External href={links.github}>GitHub<Arrow diagonal/></External><External href={links.linkedin}>LinkedIn<Arrow diagonal/></External><a href={`mailto:${links.email}`}>{links.email}<Arrow diagonal/></a></div></div><div className="contact-decoration" aria-hidden="true"><svg viewBox="0 0 300 300"><path d="M230 55H65v190h165V140H140" stroke="currentColor" fill="none" strokeWidth="2"/><path d="M245 40H50v220h195V125H125" stroke="currentColor" fill="none" strokeWidth=".5"/></svg></div>
      </section>
    </main>
    <footer className="site-footer"><div className="footer-top"><a className="wordmark" href="#top">GONELLA<span className="wordmark-dot">✳</span></a><span>{c.footer}</span><a className="text-link" href="#top">{c.top}↑</a></div><div className="footer-bottom mono"><span>© {new Date(verifiedAt).getUTCFullYear()} LUCAS GONELLA</span><span>BUILD. AUTOMATE. OPERATE.</span><span>PT / EN · {locale==='pt'?'FEITO NO BRASIL':'MADE IN BRAZIL'}</span></div></footer>
  </>
}
