import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const chromePath=process.env.LIGHTHOUSE_CHROME_PATH||chromium.executablePath()
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173'
const label=process.env.AUDIT_LABEL||'local'
await mkdir('artifacts/lighthouse',{recursive:true})
const summary=[]
for(const [name,path,desktop] of [['pt-mobile','/',false],['pt-desktop','/',true],['en-mobile','/gonella-portfolio-v1/en/',false]]){
  if(process.env.AUDIT_FILTER && !name.includes(process.env.AUDIT_FILTER))continue
  const chrome=await launch({chromePath,chromeFlags:['--headless=new','--no-first-run','--no-default-browser-check'],logLevel:'silent'})
  try{
    const result=await lighthouse(base+path,{port:chrome.port,output:['json','html'],onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error', ...(desktop?{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:1000,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}}:{})})
    if(!result)throw new Error('Lighthouse returned no result')
    await writeFile(`artifacts/lighthouse/${label}-${name}.json`,result.report[0])
    await writeFile(`artifacts/lighthouse/${label}-${name}.html`,result.report[1])
    const row={name,url:result.lhr.finalDisplayedUrl,lighthouseVersion:result.lhr.lighthouseVersion,fetchTime:result.lhr.fetchTime,environment:result.lhr.environment,configSettings:result.lhr.configSettings,scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,{value:result.lhr.audits[k].numericValue,display:result.lhr.audits[k].displayValue}])),failedAudits:Object.entries(result.lhr.audits).filter(([,v])=>v.score!==null&&v.score<.9).map(([k,v])=>({id:k,title:v.title,score:v.score,display:v.displayValue}))}
    summary.push(row)
    console.log(JSON.stringify({name,scores:row.scores,metrics:row.metrics,failedAudits:row.failedAudits}))
    await writeFile(`artifacts/lighthouse/${label}-summary.json`,JSON.stringify(summary,null,2))
  }finally{await chrome.kill()}
}
