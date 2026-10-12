import { chromium } from '@playwright/test'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
const browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL||undefined,headless:true})
const urls=['https://www.awwwards.com/','https://godly.website/','https://linear.app/','https://vercel.com/','https://www.apple.com/','https://lusion.co/','https://www.raycast.com/','https://activetheory.net/','https://www.14islands.com/','https://rauno.me/']
await mkdir('artifacts/references',{recursive:true})
const summary=[]
for(let i=0;i<urls.length;i+=3){
  await Promise.all(urls.slice(i,i+3).map(async(url)=>{
    const page=await browser.newPage({viewport:{width:1280,height:850},deviceScaleFactor:1})
    const name=new URL(url).hostname.replace(/^www\./,'')
    try{
      const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000})
      await page.waitForTimeout(2400)
      const details=await page.evaluate(()=>{const h=document.querySelector('h1');return {title:document.title,heading:h?.textContent?.slice(0,200),headingStyle:h?{font:getComputedStyle(h).fontFamily,size:getComputedStyle(h).fontSize}:null,background:getComputedStyle(document.body).backgroundColor,canvases:document.querySelectorAll('canvas').length,activeAnimations:document.getAnimations().length}})
      await page.screenshot({path:`artifacts/references/${name}.png`})
      summary.push({url,status:response?.status(),...details})
    }catch(error){summary.push({url,error:error.name})}
    await page.close()
  }))
}
await writeFile('artifacts/references/summary.json',JSON.stringify(summary,null,2))
const collage=await browser.newPage({viewport:{width:1440,height:1600}})
const items=[]
for(const s of summary){
  if(!s.status)continue
  const name=new URL(s.url).hostname.replace(/^www\./,'')
  const data=await readFile(`artifacts/references/${name}.png`)
  items.push(`<div><p>${name} / ${s.status}</p><img src="data:image/png;base64,${data.toString('base64')}"></div>`)
}
await collage.setContent(`<style>body{background:#161616;color:white;font:15px sans-serif;display:grid;grid-template-columns:1fr 1fr;gap:25px;padding:20px}img{width:100%}p{margin:0 0 8px}</style>${items.join('')}`)
await collage.screenshot({path:'artifacts/references/collage.png',fullPage:true})
console.log(JSON.stringify(summary))
await browser.close()
