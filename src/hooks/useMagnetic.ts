import { useEffect, useRef } from 'react'

type Options = {
  strength?: number
  radius?: number
}

export function useMagnetic<T extends HTMLElement>(options: Options = {}) {
  const ref = useRef<T | null>(null)
  const { strength = 0.35, radius = 160 } = options
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(hover: none)').matches) return
    let raf = 0
    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < radius) {
        const pull = 1 - dist / radius
        const tx = dx * strength * pull
        const ty = dy * strength * pull
        if (raf === 0) {
          raf = requestAnimationFrame(() => {
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
            raf = 0
          })
        }
      } else {
        el.style.transform = 'translate3d(0, 0, 0)'
      }
    }
    const leave = () => {
      el.style.transform = 'translate3d(0, 0, 0)'
    }
    window.addEventListener('pointermove', handle, { passive: true })
    el.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', handle)
      el.removeEventListener('pointerleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength, radius])
  return ref
}
