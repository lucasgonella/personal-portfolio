import { useEffect, useRef, useState } from 'react'
import { content, nodes, type Locale } from './content'
import { CoreFallback, ExplorerFallback } from './visuals'
import type { SceneController } from './scene'

type Props = { mode: 'hero' | 'explorer'; locale: Locale; selected?: number; onSelect?: (n: number) => void }
export default function SceneHost({ mode, locale, selected = 0, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<SceneController | null>(null)
  const [ready, setReady] = useState(false)
  const [requested, setRequested] = useState(false)
  const [paused, setPaused] = useState(false)
  const [canAuto, setCanAuto] = useState(false)
  const [failed, setFailed] = useState(false)
  const callback = useRef(onSelect)
  useEffect(()=>{ callback.current=onSelect },[onSelect])
  useEffect(()=>{
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const auto = !motion.matches && !connection?.saveData && window.innerWidth >= 768 && navigator.hardwareConcurrency >= 4
    setCanAuto(auto)
    const target = host.current
    if (!target || !auto) return
    let timer: ReturnType<typeof setTimeout>
    const observer=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){ timer=setTimeout(()=>setRequested(true),mode==='hero'?1400:150); observer.disconnect() }
    },{rootMargin:'100px'})
    observer.observe(target)
    const onMotion=()=>{ if(motion.matches) { setPaused(true); controller.current?.pause(true) } }
    motion.addEventListener('change',onMotion)
    return ()=>{ observer.disconnect(); clearTimeout(timer); motion.removeEventListener('change',onMotion) }
  },[mode])
  useEffect(()=>{
    if(!requested || !host.current) return
    let cancelled=false
    import('./scene').then(async ({createScene})=>{
      if(cancelled || !host.current) return
      try {
        const scene=await createScene(host.current,mode,n=>callback.current?.(n),()=>{ setFailed(true); setReady(false) },nodes.map(n=>n.label[locale]))
        if(cancelled){scene.dispose();return}
        controller.current=scene
        controller.current.select(selected)
        controller.current.pause(paused)
        setReady(true)
      } catch { setFailed(true) }
    }).catch(()=>setFailed(true))
    return ()=>{ cancelled=true; controller.current?.dispose(); controller.current=null }
    // The scene is created once. Selection and motion have their own update effects.
  },[requested,mode])
  useEffect(()=>{ controller.current?.select(selected) },[selected])
  useEffect(()=>{ controller.current?.pause(paused) },[paused])
  const c=content[locale]
  return <div className={`scene-wrap scene-${mode} ${ready?'scene-ready':''}`}>
    <div className="scene-static">{mode==='hero'?<CoreFallback/>:<ExplorerFallback selected={selected} onSelect={n=>onSelect?.(n)} labels={nodes.map(n=>n.label[locale])}/>}</div>
    <div ref={host} className="webgl-host" role="img" aria-label={mode==='hero'?c.sceneLabel:`Infrastructure Explorer — ${c.concept}`} />
    <div className="scene-controls">
      {!requested && !canAuto && <button className="scene-button" onClick={()=>setRequested(true)}>{c.activate}<span aria-hidden="true"> ↗</span></button>}
      {ready && <button className="scene-button" onClick={()=>setPaused(!paused)} aria-pressed={paused}><span aria-hidden="true">{paused?'▷':'Ⅱ'}</span> {paused?c.resume:c.pause}</button>}
      {failed && <span className="scene-fallback-note">{c.concept} · SVG</span>}
    </div>
  </div>
}
