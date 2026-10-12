import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { render } from '../.deploy/ssr/entry-server.js'
import postcss from 'postcss'

const base='https://gonella.com.br'
const enUrl=`${base}/gonella-portfolio-v1/en/`
const html=await readFile('dist/index.html','utf8')
const data=JSON.parse(await readFile('src/data/projects.json','utf8'))
const assets=await readdir('dist/gonella-portfolio-v1')
const manrope=assets.find(n=>n.includes('manrope-latin-wght-normal')&&n.endsWith('.woff2'))
const cssName=assets.find(n=>n.endsWith('.css'))
const stylesheet=await readFile(`dist/gonella-portfolio-v1/${cssName}`,'utf8')
const critical=postcss.parse(stylesheet)
critical.walkRules(rule=>{
  let ancestor=rule.parent
  let layer=''
  while(ancestor){if(ancestor.type==='atrule'&&ancestor.name==='layer')layer=ancestor.params;ancestor=ancestor.parent}
  if(layer==='reset'||layer==='base')return
  if(/\.(hero|site-header|wordmark|nav|header-actions|header-github|language-switch|menu-button|skip-link|art-orbit|orbit-|core-annotation|annotation-|scene-|webgl-|core-fallback|scroll-symbol)/.test(rule.selector)||!rule.selector.includes('.'))return
  rule.remove()
})
critical.walkAtRules(rule=>{if(rule.nodes && rule.nodes.length===0)rule.remove()})
const criticalCss=critical.toString()
const person={ '@type':'Person', '@id':`${base}/#person`, name:'Lucas Gonella', alternateName:'GONELLA', url:base+'/', jobTitle:'Senior Systems Administrator', sameAs:['https://github.com/lucasgonella','https://www.linkedin.com/in/lucasgonella/'], knowsAbout:['Systems Administration','Cloud Infrastructure','DevOps','Site Reliability Engineering','Infrastructure as Code','Automation'], alumniOf:undefined }
const graph={'@context':'https://schema.org','@graph':[person,{'@type':'WebSite','@id':`${base}/#website`,url:base+'/',name:'GONELLA — Lucas Gonella',inLanguage:['pt-BR','en'],author:{'@id':`${base}/#person`}},...data.repositories.map(repo=>({'@type':'SoftwareSourceCode',name:repo.name,codeRepository:repo.url,programmingLanguage:repo.languages,author:{'@id':`${base}/#person`}}))]}
for(const locale of ['pt','en']){
  let page=html.replace('<div id="root"></div>',`<div id="root">${render(locale)}</div>`)
  if(manrope)page=page.replace('<head>',`<head><link rel="preload" href="/gonella-portfolio-v1/${manrope}" as="font" type="font/woff2" crossorigin>`)
  page=page.replace(/<link rel="stylesheet"([^>]*href="([^"]+)"[^>]*)>/,(_,attributes,url)=>`<style data-portfolio-critical>${criticalCss}</style><link rel="stylesheet"${attributes} media="print" id="portfolio-css"><script>document.getElementById('portfolio-css').addEventListener('load',function(){this.media='all'})</script><noscript><link rel="stylesheet" href="${url}"></noscript>`)
  page=page.replace('</head>',`<script type="application/ld+json">${JSON.stringify(graph).replace(/</g,'\\u003c')}</script></head>`)
  if(locale==='en'){
    page=page.replace('<html lang="pt-BR">','<html lang="en">')
    page=page.replace('<link rel="canonical" href="https://gonella.com.br/" />',`<link rel="canonical" href="${enUrl}" />`)
    page=page.replace('<meta property="og:url" content="https://gonella.com.br/" />',`<meta property="og:url" content="${enUrl}" />`)
    page=page.replace('content="pt_BR"','content="en_US"')
    page=page.replaceAll('Lucas Gonella — Infraestrutura. Automação. Confiabilidade.','Lucas Gonella — Infrastructure. Automation. Reliability.')
    page=page.replace('Lucas Gonella — engenharia de infraestrutura, cloud, DevOps e SRE. Explore projetos reais de automação, observabilidade e sistemas.','Lucas Gonella — infrastructure engineering, cloud, DevOps and SRE. Explore real projects in automation, observability and systems.')
    page=page.replace('Engenharia por trás do que importa. Projetos reais, sistemas conectados e infraestrutura explorável.','Engineering behind what matters. Real projects, connected systems and explorable infrastructure.')
    await mkdir('dist/gonella-portfolio-v1/en',{recursive:true})
    await writeFile('dist/gonella-portfolio-v1/en/index.html',page)
  }else await writeFile('dist/index.html',page)
}
console.log(`Prerendered Portuguese and English: indexable content, structured data and ${(criticalCss.length/1024).toFixed(1)} KiB of critical CSS.`)
