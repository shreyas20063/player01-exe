import { useEffect, useRef, useState } from 'react'

export type MousePosition = {
  x: number
  y: number
  normX: number
  normY: number
}

const initial: MousePosition = { x: 0, y: 0, normX: 0, normY: 0 }

export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>(initial)
  const frame = useRef(0)
  const latest = useRef(initial)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      latest.current = {
        x: e.clientX,
        y: e.clientY,
        normX: (e.clientX / w) * 2 - 1,
        normY: -((e.clientY / h) * 2 - 1),
      }
      if (frame.current === 0) {
        frame.current = requestAnimationFrame(() => {
          setPos(latest.current)
          frame.current = 0
        })
      }
    }
    window.addEventListener('pointermove', handler, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handler)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])
  return pos
}
