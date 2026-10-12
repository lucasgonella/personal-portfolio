import { useId } from 'react'
import type { Locale } from './content'
import type { Project } from './projects'

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function Glyph({ type = 0 }: { type?: number }) {
  const paths = ['M4 4h16v5H4zm0 11h16v5H4zM7 7h.01M7 18h.01', 'M5 17a4 4 0 0 1-1-7 7 7 0 0 1 13-2 5 5 0 0 1 1 10H5', 'M4 7 12 3l8 4v10l-8 4-8-4V7zm0 0 8 5 8-5m-8 5v9', 'm8 5-6 7 6 7m8-14 6 7-6 7m-3-15-2 16', 'M3 19V5m0 14h18M6 15l4-6 4 4 7-9', 'm13 2-9 12h7l-1 8 10-13h-7l1-7', 'M12 3v6m0 6v6M3 12h6m6 0h6M9 9h6v6H9z', 'M6 6h12v12H6zM2 6h4m12 12h4M6 2v4m12 12v4']
  return <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={paths[type % paths.length]} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function CoreFallback() {
  const id = useId().replace(/:/g, '')
  return <svg className="core-fallback" viewBox="0 0 680 660" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3b484c"/><stop offset=".5" stopColor="#172126"/><stop offset="1" stopColor="#374f50"/></linearGradient>
      <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1c282e"/><stop offset="1" stopColor="#091013"/></linearGradient>
      <linearGradient id={`${id}-side`}><stop stopColor="#141c22"/><stop offset="1" stopColor="#2c3a42"/></linearGradient>
      <radialGradient id={`${id}-glow`}><stop stopColor="#85e8d3" stopOpacity=".17"/><stop offset="1" stopColor="#85e8d3" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="355" cy="460" rx="255" ry="165" fill={`url(#${id}-glow)`}/>
    <g fill="none" stroke="#3a5451" strokeWidth=".7" opacity=".45">
      {Array.from({length:9},(_,i)=><path key={i} d={`M${80+i*32} ${450-i*17}l285 155M${100+i*32} ${606-i*17}l285-155`}/>)}
    </g>
    {[3,2,1,0].map(layer => <g key={layer} className={`fallback-layer layer-${layer}`} transform={`translate(0 ${layer*81})`}>
      <polygon points="337,81 523,181 337,282 151,181" fill={`url(#${id}-top)`} stroke="#738781" strokeOpacity=".45"/>
      <polygon points="151,181 337,282 337,320 151,219" fill={`url(#${id}-front)`} stroke="#273b3e"/>
      <polygon points="337,282 523,181 523,219 337,320" fill={`url(#${id}-side)`} stroke="#2c4145"/>
      <polygon points="337,135 423,181 337,228 251,181" fill="#0c1316" stroke="#4d6c68" strokeWidth="1"/>
      <polygon points="337,149 401,183 337,217 273,183" fill={layer===0?'#a9f5db':'#1e4742'} opacity={layer===0?.6:.8}/>
      <path d="M170 191l145 79m43 0 145-79" fill="none" stroke={layer===1?'#afa8ef':'#a1f8de'} strokeWidth="2" opacity=".8"/>
      <g stroke="#6d827d" strokeWidth=".8" opacity=".6"><path d="m198 158 186 101m-140-125 186 101m-47-101-186 101m140-125-186 101"/></g>
      {[0,1,2,3,4].map(j=><path key={j} d={`M${175+j*25} ${210+j*13.5}l14 7.5`} stroke="#324748" strokeWidth="4"/>)}
      {[0,1,2].map(j=><circle key={j} cx={473+j*10} cy={243-j*5.5} r="1.5" fill="#aeefd5"/>)}
    </g>)}
    <g stroke="#81b8a8" strokeWidth=".6" fill="none" opacity=".6"><path d="M523 182h64v-58h35M150 425H67v45H40M338 81V37h60"/><circle cx="622" cy="124" r="3"/><circle cx="40" cy="470" r="3"/></g>
  </svg>
}

export function ExplorerFallback({ selected, onSelect, labels }: { selected: number; onSelect: (n: number) => void; labels: string[] }) {
  const positions = [[320,225],[147,143],[495,142],[125,319],[517,320],[321,70],[320,395]]
  return <svg className="explorer-fallback" viewBox="0 0 640 460" aria-hidden="true">
    <g stroke="#354440" strokeWidth=".7" opacity=".4">{Array.from({length:14},(_,i)=><path key={i} d={`M${i*50-160} 40l520 340m-520 0 520-340`}/>)}</g>
    {positions.slice(1).map(([x,y],i)=><path key={i} d={`M320 225 ${x} ${y}`} stroke={selected===i+1?'#baf4dc':'#3d5650'} strokeWidth={selected===i+1?2:1} strokeDasharray="4 5" className="network-link"/>) }
    {positions.map(([x,y],i)=><g key={i} className={`diagram-node ${selected===i?'selected':''}`} transform={`translate(${x} ${y})`} onClick={()=>onSelect(i)} style={{cursor:'pointer'}}>
      <polygon points="0,-30 42,-8 0,16 -42,-8" fill={selected===i?'#426b60':'#22302f'} stroke={selected===i?'#baf4dc':'#536d64'}/>
      <polygon points="-42,-8 0,16 0,39 -42,15" fill="#14201e" stroke="#40534c"/>
      <polygon points="0,16 42,-8 42,15 0,39" fill="#1c2b25" stroke="#40534c"/>
      <path d="m-32 10 25 13m15 0 25-13" stroke={selected===i?'#c0f9e2':'#608472'} fill="none" strokeWidth="2"/>
      <text x="0" y="-5" textAnchor="middle" fill="#c9ddd3" fontSize="11" fontFamily="monospace">{String(i+1).padStart(2,'0')}</text>
      <text x="0" y="63" textAnchor="middle" fill="#b3c0ba" fontSize="11" fontFamily="monospace">{labels[i]}</text>
    </g>)}
  </svg>
}

export function ProjectVisual({ project, locale }: { project: Project; locale: Locale }) {
  const en = locale === 'en'
  return <div className={`project-visual visual-${project.visual}`} aria-hidden="true">
    <div className="visual-top"><span>{project.visual==='lab'?'LAB / INFRASTRUCTURE':project.visual==='election'?'DATA / FLOW':project.visual==='metrics'?'METRICS / LAB':project.visual==='terraform'?'IAC / PROVISION':'CI / DELIVERY'}</span><span className="visual-cross">+</span></div>
    {project.visual==='lab' && <><div className="lab-platform"><div className="lab-machine machine-1"><i/><i/><i/><b>PVE</b></div><div className="lab-machine machine-2"><i/><i/><b>VM</b></div><div className="lab-machine machine-3"><i/><i/><b>DNS</b></div><div className="lab-machine machine-4"><i/><i/><b>OBS</b></div><div className="lab-wire wire-1"/><div className="lab-wire wire-2"/><div className="lab-wire wire-3"/></div><div className="visual-bottom"><span>PROXMOX → ANSIBLE → SERVICES</span><span>01 / 04</span></div></>}
    {project.visual==='election' && <><div className="election-flow">{['TSE','PYTHON','POSTGRESQL','WEB'].map((s,i)=><div className="flow-stage" key={s}><span className="flow-index">0{i+1}</span><Glyph type={[1,3,0,4][i]}/><b>{s}</b>{i<3&&<span className="flow-connector">→</span>}</div>)}</div><div className="data-lines"><span>{en?'PUBLIC SOURCE':'FONTE PÚBLICA'}</span><svg viewBox="0 0 500 68"><path d="M0 60H500M0 30H500" stroke="#ffffff12"/><path d="M0 52h28l10-19 16 5 22-18 15 24 20-6 14-24 28 8 15 29 25-9 20-29 18 10 30-12 17 30 22-9 14-22 24 9 19-15 16 32 30-16 17 9 17-24 30 19 20-10" stroke="#b8edda" fill="none" strokeWidth="1.5"/></svg><span>{en?'STATIC INTERFACE':'INTERFACE ESTÁTICA'}</span></div><div className="visual-bottom"><span>{en?'COLLECT → PROCESS → PUBLISH':'COLETAR → PROCESSAR → PUBLICAR'}</span><span>DATA PIPELINE</span></div></>}
    {project.visual==='pipeline' && <><div className="pipeline-flow">{['git push','pytest','docker build','GHCR','deploy / rollback'].map((s,i)=><div key={s}><span className="pipeline-dot">{i+1}</span><span>{s}</span>{i<4&&<i/>}</div>)}</div><div className="pipeline-code"><span className="code-muted"># delivery as a process</span><p><em>test</em> → <em>build</em> → <em>verify</em></p><p><span>on_failure</span> <b>retry / rollback</b></p></div><div className="visual-bottom"><span>COMMIT → IMAGE → DELIVERY</span><span>{en?'PROCESS DIAGRAM':'DIAGRAMA DE PROCESSO'}</span></div></>}
    {project.visual==='terraform' && <><div className="terraform-visual"><div className="tf-file"><span>main.tf</span><p><em>resource</em> <b>"aws_instance"</b></p><p><span>configuration</span> = code</p><p><span>lifecycle</span> = managed</p><small>HCL / TERRAFORM</small></div><div className="tf-resources"><div><Glyph type={1}/><span>CLOUD</span></div><div><Glyph type={0}/><span>COMPUTE</span></div><div><Glyph type={6}/><span>NETWORK</span></div></div></div><div className="visual-bottom"><span>INIT → PLAN → APPLY</span><span>{en?'CONCEPTUAL':'CONCEITUAL'}</span></div></>}
    {project.visual==='metrics' && <><div className="metrics-dashboard"><div className="metric-plot"><span>APPLICATION / SIGNAL</span><svg viewBox="0 0 500 120"><path d="M0 20H500M0 60H500M0 100H500" stroke="#ffffff10"/><path className="metric-line" d="M0 83 20 81 30 48 47 65 60 61 74 34 91 65 112 60 127 47 140 69 161 55 176 71 193 43 207 37 229 60 247 48 260 71 274 38 289 26 306 53 323 38 340 68 359 31 381 47 401 28 421 44 443 14 460 38 477 20 500 29" stroke="#b6f4da" strokeWidth="2" fill="none"/><path d="M0 100 29 99 41 90 58 96 82 95 108 86 127 89 151 94 173 80 197 87 215 81 241 82 267 65 290 72 317 77 341 67 370 59 395 63 420 46 447 52 470 41 500 43" stroke="#a59acb" strokeWidth="1.5" fill="none"/></svg></div><div className="metric-path"><span>MICROMETER</span><i>→</i><span>PROMETHEUS</span><i>→</i><span>GRAFANA</span></div></div><div className="visual-bottom"><span>{en?'SIMULATED SIGNALS / NO LIVE DATA':'SINAIS SIMULADOS / SEM DADOS REAIS'}</span><span>OBS / LAB</span></div></>}
  </div>
}
