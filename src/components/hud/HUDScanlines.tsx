import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Glitch = {
  key: number
  top: number
  height: number
  offset: number
}

export function HUDScanlines() {
  const [glitch, setGlitch] = useState<Glitch | null>(null)

  useEffect(() => {
    let counter = 0
    let hideTimer: number = 0
    let nextTimer: number = 0
    let cancelled = false

    const scheduleNext = (): void => {
      const delay = 20000 + Math.random() * 10000 // ~20-30s
      nextTimer = window.setTimeout(() => {
        if (cancelled) return
        counter += 1
        const top = 10 + Math.random() * 70
        const height = 8 + Math.random() * 22
        const offset = Math.random() > 0.5 ? 3 : -3
        setGlitch({ key: counter, top, height, offset })
        hideTimer = window.setTimeout(() => {
          if (!cancelled) setGlitch(null)
        }, 80)
        scheduleNext()
      }, delay)
    }

    scheduleNext()
    return () => {
      cancelled = true
      window.clearTimeout(nextTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    >
      <div className="crt-scanlines absolute inset-0 opacity-70" />
      <AnimatePresence>
        {glitch && (
          <motion.div
            key={glitch.key}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 0.5, x: glitch.offset }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.08 }}
            className="absolute left-0 right-0 overflow-hidden"
            style={{
              top: `${glitch.top}%`,
              height: `${glitch.height}px`,
              mixBlendMode: 'screen',
              background:
                'repeating-linear-gradient(to bottom, rgba(255,45,107,0.18) 0 2px, rgba(74,248,255,0.1) 2px 4px, transparent 4px 6px)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
