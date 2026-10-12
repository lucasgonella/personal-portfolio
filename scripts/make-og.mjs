import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
const browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL||undefined,headless:true})
const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1})
await page.goto(process.env.TEST_BASE_URL||'http://127.0.0.1:4173')
await page.emulateMedia({reducedMotion:'reduce'})
await page.addStyleTag({content:'.site-header,.hero-topline,.hero-ctas,.hero-contact,.hero-bottom,.hero-art-caption,.scene-controls,.hero-role{display:none!important}.hero{height:630px;min-height:630px;padding:80px}.hero-content{padding-top:30px;width:65%}.hero h1{font-size:94px}.hero-art{top:0;right:-8%;height:630px;width:62%}.hero-intro{max-width:360px;margin-top:30px}.hero::before{content:"GONELLA / LUCAS GONELLA";position:absolute;left:80px;top:60px;color:#b6f4da;font:11px monospace;letter-spacing:3px}.hero-content::after{content:"INFRASTRUCTURE. AUTOMATION. RELIABILITY.";display:block;color:#83958b;font:9px monospace;letter-spacing:1px;margin-top:25px}'} )
await page.evaluate(()=>document.fonts.ready)
await mkdir('public/gonella-portfolio-v1',{recursive:true})
await page.screenshot({path:'public/gonella-portfolio-v1/og-gonella.png'})
await browser.close()
console.log('Generated original Open Graph image from the portfolio artwork.')
