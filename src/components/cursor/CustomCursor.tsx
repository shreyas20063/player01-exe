import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsMobile } from '@/hooks/useIsMobile'

type CursorMode = 'idle' | 'lock' | 'label'

function isInteractive(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName
  if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    return true
  }
  if ((el as HTMLElement).getAttribute('role') === 'button') return true
  return false
}

function findLabel(el: Element | null): string | null {
  let cur: Element | null = el
  while (cur) {
    const v = (cur as HTMLElement).getAttribute?.('data-cursor')
    if (v != null) return v
    cur = cur.parentElement
  }
  return null
}

export function CustomCursor() {
  const isMobile = useIsMobile()
  const [hoverDisabled, setHoverDisabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(hover: none)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mql = window.matchMedia('(hover: none)')
    const handler = (e: MediaQueryListEvent) => setHoverDisabled(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  const [mode, setMode] = useState<CursorMode>('idle')
  const [label, setLabel] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    if (hoverDisabled || isMobile) return undefined

    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = document.elementFromPoint(e.clientX, e.clientY)
      const lbl = findLabel(target)
      if (lbl != null && lbl.length > 0) {
        setMode('label')
        setLabel(lbl)
      } else if (isInteractive(target)) {
        setMode('lock')
        setLabel('')
      } else {
        setMode('idle')
        setLabel('')
      }
    }

    const handleLeave = () => setVisible(false)
    const handleEnter = () => setVisible(true)

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerleave', handleLeave)
    window.addEventListener('pointerenter', handleEnter)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerleave', handleLeave)
      window.removeEventListener('pointerenter', handleEnter)
    }
  }, [hoverDisabled, isMobile, x, y])

  if (hoverDisabled || isMobile) return null

  const scale = mode === 'idle' ? 1 : mode === 'lock' ? 1.05 : 1.15

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{
        x: sx,
        y: sy,
        mixBlendMode: 'difference',
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2"
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {mode === 'lock' ? (
          <div
            className="h-3 w-3 bg-text"
            style={{ boxShadow: '0 0 6px #F5F0FF' }}
          />
        ) : (
          <div className="relative h-5 w-5">
            <span className="absolute left-1/2 top-0 block h-5 w-[1px] -translate-x-1/2 bg-text" />
            <span className="absolute left-0 top-1/2 block h-[1px] w-5 -translate-y-1/2 bg-text" />
            <span className="absolute left-1/2 top-1/2 block h-1 w-1 -translate-x-1/2 -translate-y-1/2 border border-text" />
          </div>
        )}
      </motion.div>

      {mode === 'label' && label.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 14 }}
          exit={{ opacity: 0 }}
          className="absolute left-0 top-0 whitespace-nowrap border border-text/60 bg-void/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-text"
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  )
}
