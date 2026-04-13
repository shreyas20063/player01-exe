import { useEffect, type ReactNode } from 'react'
import { createLenis } from '@/lib/lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: Props) {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const lenis = createLenis()
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    const refreshAfterFonts = () => ScrollTrigger.refresh()
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(refreshAfterFonts).catch(() => undefined)
    }
    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [reduced])
  return <>{children}</>
}
