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
