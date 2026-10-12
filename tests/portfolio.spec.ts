import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('Portuguese content, topology selection, project details, timeline, stack and navigation work',async({page,isMobile})=>{
  const errors:string[]=[]
  page.on('pageerror',error=>errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading',{level:1})).toContainText('Engenharia')
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
  await expect(page.getByRole('heading',{level:1})).toContainText('Engineering')
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
  await page.locator('.scene-hero').getByRole('button',{name:'Pausar movimento'}).click()
  await expect(page.locator('.scene-hero').getByRole('button',{name:'Retomar movimento'})).toHaveAttribute('aria-pressed','true')
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
  await expect(page.getByRole('heading',{level:1})).toContainText('Engenharia')
  await expect(page.getByRole('heading',{name:'Homelab como código'})).toBeVisible()
  await expect(page.locator('.hero')).toHaveCSS('position','relative')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)
  await page.getByRole('link',{name:'EN',exact:true}).click()
  await expect(page.locator('html')).toHaveAttribute('lang','en')
  await expect(page.getByRole('heading',{level:1})).toContainText('Engineering')
  await context.close()
})
