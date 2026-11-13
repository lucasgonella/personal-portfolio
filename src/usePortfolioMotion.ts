import { useEffect, type RefObject } from 'react'

/** Load optional motion only for a visible desktop experience that permits it. */
export function usePortfolioMotion(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 768px)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    let cancelled = false
    let version = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let cleanup: (() => void) | undefined

    function synchronize() {
      const current = ++version
      clearTimeout(timer)
      cleanup?.()
      cleanup = undefined
      if (!preference.matches || document.hidden || connection?.saveData) return

      timer = setTimeout(() => {
        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled || current !== version || !preference.matches || document.hidden) return
          gsap.registerPlugin(ScrollTrigger)
          const context = gsap.context(() => {
            document.querySelectorAll('[data-reveal]').forEach(element => {
              gsap.from(element, { y: 24, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } })
            })
            gsap.to('.hero-art', { y: 45, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
          }, scope)
          cleanup = () => context.revert()
        }).catch(() => { /* Optional motion must never hide content on failure. */ })
      }, 1900)
    }

    synchronize()
    preference.addEventListener('change', synchronize)
    document.addEventListener('visibilitychange', synchronize)
    return () => {
      cancelled = true
      version++
      clearTimeout(timer)
      cleanup?.()
      preference.removeEventListener('change', synchronize)
      document.removeEventListener('visibilitychange', synchronize)
    }
  }, [scope])
}
