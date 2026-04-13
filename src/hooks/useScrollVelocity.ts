import { useEffect, useState } from 'react'

export function useScrollVelocity(): number {
  const [velocity, setVelocity] = useState(0)
  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()
    let raf = 0
    const tick = () => {
      const now = performance.now()
      const y = window.scrollY
      const dt = Math.max(1, now - lastT)
      const v = (y - lastY) / dt
      setVelocity(v)
      lastY = y
      lastT = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return velocity
}
