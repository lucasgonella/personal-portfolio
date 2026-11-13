import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('Portuguese content, topology selection, project details, timeline, stack and navigation work',async({page,isMobile})=>{
  const errors:string[]=[]
  page.on('pageerror',error=>errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading',{level:1})).toContainText('Infraestrutura')
  const selector=page.getByRole('group',{name:'Selecione um nó para explorar'})
  await selector.getByRole('button',{name:'05 Observabilidade'}).click()
  await expect(page.locator('.node-panel h3')).toHaveText('Observabilidade')
  await page.locator('.node-project a').click()
  await expect(page.locator('#details-prometheus-grafana')).toBeVisible()
  await expect(page.locator('#details-prometheus-grafana')).toContainText('simulados')
  await page.getByRole('button',{name:'A evolução Sistemas & cloud'}).click()
  await expect(page.locator('#timeline-1')).toBeVisible()
  await page.getByRole('button',{name:'06 Automação Python Shell Ansible'}).click()
  await expect(page.locator('.stack-context')).toContainText('rotinas')
  if(isMobile){
    await page.getByRole('button',{name:'Abrir navegação'}).click()
    await page.locator('#primary-nav').getByRole('link',{name:'Contato',exact:true}).click()
    await expect(page.getByRole('button',{name:'Abrir navegação'})).toHaveAttribute('aria-expanded','false')
  }
  await expect(page.getByRole('link',{name:'Enviar um e-mail'})).toHaveAttribute('href','mailto:goonella@hotmail.com')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('English is prerendered, complete and switchable',async({page})=>{
  await page.goto('/gonella-portfolio-v1/en/')
  await expect(page.locator('html')).toHaveAttribute('lang','en')
  await expect(page.getByRole('heading',{level:1})).toContainText('Infrastructure')
  await expect(page.getByRole('heading',{name:'From public source to insight'})).toBeVisible()
  await expect(page.getByRole('link',{name:'Send an email'})).toHaveAttribute('href','mailto:goonella@hotmail.com')
  await page.getByRole('link',{name:'PT',exact:true}).click()
  await expect(page.locator('html')).toHaveAttribute('lang','pt-BR')
})

test('Reduced motion uses static art and retains accessible interactions',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  await page.waitForTimeout(2200)
  await expect(page.locator('canvas')).toHaveCount(0)
  await page.getByRole('group',{name:'Selecione um nó para explorar'}).getByRole('button',{name:'04 Automação'}).click()
  await expect(page.locator('.node-panel h3')).toHaveText('Automação')
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link',{name:'Pular para o conteúdo'})).toBeFocused()
})

test('WCAG accessibility audit in both locales',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'})
  for(const path of ['/','/gonella-portfolio-v1/en/']){
    await page.goto(path)
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()
    expect(results.violations.map(v=>({id:v.id,description:v.description,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
  }
})

test('WebGL works when requested and context loss restores static art',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  await page.locator('.scene-hero').getByRole('button',{name:'Ativar experiência 3D'}).click()
  await expect(page.locator('.scene-hero canvas')).toBeVisible({timeout:20000})
  await expect(page.locator('.scene-hero')).toHaveClass(/scene-ready/)
  await expect(page.locator('.scene-hero').getByRole('button',{name:'Retomar movimento'})).toHaveAttribute('aria-pressed','true')
  await page.locator('.scene-hero').getByRole('button',{name:'Retomar movimento'}).click()
  await page.locator('.scene-hero').getByRole('button',{name:'Pausar movimento'}).click()
  await page.locator('.scene-hero canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})))
  await expect(page.locator('.scene-hero')).not.toHaveClass(/scene-ready/)
  await expect(page.locator('.scene-hero .scene-fallback-note')).toBeVisible()
})

test('Unavailable WebGL keeps the SVG fallback and topology controls functional',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext=function(type:string,options?:unknown){
      if(type==='webgl'||type==='webgl2')return null
      return original.call(this,type,options)
    } as typeof original
  })
  await page.goto('/')
  await page.locator('.scene-hero').getByRole('button',{name:'Ativar experiência 3D'}).click()
  await expect(page.locator('.scene-hero .scene-fallback-note')).toBeVisible()
  await expect(page.locator('.scene-hero')).not.toHaveClass(/scene-ready/)
  await page.getByRole('group',{name:'Selecione um nó para explorar'}).getByRole('button',{name:'03 Redes'}).click()
  await expect(page.locator('.node-panel h3')).toHaveText('Redes')
})

test('Static content and layout remain available without JavaScript',async({browser,baseURL,isMobile})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:isMobile?{width:390,height:844}:{width:1440,height:1000}})
  const page=await context.newPage()
  await page.goto(baseURL+'/')
  await expect(page.getByRole('heading',{level:1})).toContainText('Infraestrutura')
  await expect(page.getByRole('heading',{name:'Homelab como código'})).toBeVisible()
  await expect(page.locator('#details-devops-sre-lab')).toBeVisible()
  await expect(page.locator('#timeline-1')).toBeVisible()
  await expect(page.locator('#primary-nav').getByRole('link',{name:'Contato',exact:true})).toBeVisible()
  await expect(page.locator('.hero')).toHaveCSS('position','relative')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)
  await page.getByRole('link',{name:'EN',exact:true}).click()
  await expect(page.locator('html')).toHaveAttribute('lang','en')
  await expect(page.getByRole('heading',{level:1})).toContainText('Infrastructure')
  await context.close()
})

test('Career direction, evidence links and localized SEO distinguish the current role',async({page})=>{
  for(const [path,role] of [['/','Analista de Infraestrutura Sênior'],['/gonella-portfolio-v1/en/','Senior Infrastructure Analyst']]){
    await page.goto(path)
    await expect(page.locator('.hero-role')).toHaveText(role)
    await expect(page).toHaveTitle(/Platform/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/Platform Engineering/)
    await expect(page.locator('.hero-goal')).toContainText('DevOps · SRE · Platform Engineering')
    const graph=await page.locator('script[type="application/ld+json"]').textContent()
    expect(JSON.parse(graph!)['@graph'][0].jobTitle).toBe(role)
    const destinations=await page.locator('.practice-grid > a').evaluateAll(links=>links.map(link=>link.getAttribute('href')))
    expect(destinations).toHaveLength(3)
    await page.locator('.practice-grid > a').nth(1).click()
    await expect(page.locator('#details-devops-sre-lab')).toBeVisible()
    await expect(page.locator('#details-devops-sre-lab')).toContainText('2026')
    expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(3)
  }
})

test('Changing motion preference pauses active 3D and reverts scroll transforms',async({page})=>{
  await page.goto('/')
  await expect(page.locator('.stack-card').first()).toBeEnabled()
  const activate=page.locator('.scene-hero').getByRole('button',{name:'Ativar experiência 3D'})
  if(await activate.isVisible()) await activate.click()
  await expect(page.locator('.scene-hero canvas')).toBeVisible({timeout:20000})
  await page.emulateMedia({reducedMotion:'reduce'})
  await expect(page.locator('.scene-hero').getByRole('button',{name:'Retomar movimento'})).toHaveAttribute('aria-pressed','true')
  await expect(page.locator('.hero-art')).toHaveCSS('transform','none')
})

test('Denied clipboard access keeps the email action available',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))}}))
  await page.goto('/')
  await page.getByRole('button',{name:'Copiar e-mail',exact:true}).click()
  await expect(page.getByRole('status')).toContainText('Use o link de e-mail')
  await expect(page.getByRole('link',{name:'Enviar um e-mail'})).toHaveAttribute('href','mailto:goonella@hotmail.com')
})

test('Small mobile viewport has readable career context and no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:740})
  for(const path of ['/','/gonella-portfolio-v1/en/']){
    await page.goto(path)
    await expect(page.locator('.hero-goal')).toBeVisible()
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)
  }
})

test('Mobile header stays stable while the application module loads',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  let release!:()=>void
  const gate=new Promise<void>(resolve=>{release=resolve})
  await page.route('**/gonella-portfolio-v1/index-*.js',async route=>{await gate;await route.continue()})
  try{
    await page.goto('/',{waitUntil:'commit'})
    await expect(page.locator('html')).toHaveClass(/js/)
    await expect(page.locator('.site-header')).toBeVisible()
    const initialHeight=await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().height)
    expect(initialHeight).toBe(70)
    release()
    await expect(page.locator('.stack-card').first()).toBeEnabled()
    expect(await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().height)).toBe(initialHeight)
  }finally{release()}
})

test('Professional context precedes labs and every project exposes a decision and source',async({page})=>{
  await page.goto('/')
  expect(await page.locator('main > section[id]').evaluateAll(sections=>sections.map(section=>section.id))).toEqual(['top','about','expertise','projects','explorer','contact'])
  await expect(page.locator('.proof-band')).toContainText('Infraestrutura corporativa')
  await expect(page.locator('.project-card').first()).toHaveAttribute('id','project-devops-sre-lab')
  await expect(page.locator('.project-kind').first()).toContainText('Laboratório')
  await expect(page.locator('.project-evidence')).toHaveCount(5)
  for(const evidence of await page.locator('.project-evidence').all()){
    await expect(evidence).toContainText('DECISÃO DE ENGENHARIA')
    await expect(evidence.getByRole('link')).toHaveAttribute('href',/^https:\/\/github\.com\/lucasgonella\//)
  }
})

test('Hero layers are selectable with an accessible static alternative',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  const layers=page.getByRole('group',{name:'Explore as camadas de infraestrutura'})
  await layers.getByRole('button',{name:'Compute',exact:true}).click()
  await expect(layers.getByRole('button',{name:'Compute',exact:true})).toHaveAttribute('aria-pressed','true')
  await expect(page.locator('.hero-layer-note')).toContainText('Recursos')
  await expect(page.locator('.scene-hero canvas')).toHaveCount(0)
  await layers.getByRole('button',{name:'Redes',exact:true}).focus()
  await page.keyboard.press('Enter')
  await expect(layers.getByRole('button',{name:'Redes',exact:true})).toHaveAttribute('aria-pressed','true')
})

test('Security node and reset perspective work without introducing runtime errors',async({page})=>{
  const errors:string[]=[]
  page.on('pageerror',error=>errors.push(error.message))
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  await page.getByRole('group',{name:'Selecione um nó para explorar'}).getByRole('button',{name:'08 Segurança'}).click()
  await expect(page.locator('.node-panel h3')).toHaveText('Segurança')
  await expect(page.locator('.node-panel p')).toContainText('permissões restritas')
  await page.locator('.scene-explorer').getByRole('button',{name:'Ativar experiência 3D'}).click()
  await expect(page.locator('.scene-explorer')).toHaveClass(/scene-ready/,{timeout:20000})
  await page.locator('.scene-explorer').getByRole('button',{name:'Restaurar perspectiva'}).click()
  await expect(page.locator('.node-panel h3')).toHaveText('Segurança')
  expect(errors).toEqual([])
})

test('Reduced motion avoids loading optional motion and WebGL chunks',async({page})=>{
  const scripts:string[]=[]
  page.on('request',request=>{if(request.resourceType()==='script')scripts.push(request.url())})
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  await page.waitForTimeout(2200)
  expect(scripts.filter(url=>url.endsWith('.js'))).toHaveLength(1)
})

test('Responsive headings and all internal links stay within the intended document',async({page})=>{
  for(const width of [320,768,1024,1440]){
    await page.setViewportSize({width,height:900})
    await page.goto('/gonella-portfolio-v1/en/')
    expect(await page.locator('.hero-line').evaluateAll(elements=>elements.every(element=>{
      const range=document.createRange();range.selectNodeContents(element)
      const rect=range.getBoundingClientRect()
      return rect.left>=0&&rect.right<=window.innerWidth
    }))).toBe(true)
    expect(await page.locator('a[href^="#"]').evaluateAll(links=>links.every(link=>Boolean(document.getElementById(link.getAttribute('href')!.slice(1)))))).toBe(true)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://gonella.com.br/gonella-portfolio-v1/en/')
  }
})
