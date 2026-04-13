import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'
import { bootLog } from '@/data/boot-log'
import { cn } from '@/lib/cn'

const CHAR_MS = 40
const LINE_GAP_MS = 80

export function BootSequence() {
  const [visible, setVisible] = useState(true)
  const [typed, setTyped] = useState<string[]>([])
  const [flashDone, setFlashDone] = useState(false)
  const doneRef = useRef(false)
  // Capture firstVisit on mount only; don't re-read on updates.
  const firstVisitRef = useRef(useGameStore.getState().firstVisit)

  useEffect(() => {
    let cancelled = false

    const complete = () => {
      if (doneRef.current || cancelled) return
      doneRef.current = true
      const store = useGameStore.getState()
      store.setBooted(true)
      store.unlock('first_boot')
      store.markVisited()
      // brief fade before unmount
      window.setTimeout(() => {
        if (!cancelled) setVisible(false)
      }, 260)
    }

    // Fast path for returning visitors: ~400ms flash
    if (!firstVisitRef.current) {
      setTyped(bootLog)
      const flashT = window.setTimeout(() => setFlashDone(true), 120)
      const doneT = window.setTimeout(complete, 400)
      return () => {
        cancelled = true
        window.clearTimeout(flashT)
        window.clearTimeout(doneT)
      }
    }

    // First-visit typewriter
    const timeouts: number[] = []
    const flashT = window.setTimeout(() => setFlashDone(true), 320)
    timeouts.push(flashT)

    let elapsed = 420 // wait for CRT flash to finish
    for (let li = 0; li < bootLog.length; li++) {
      const line = bootLog[li] ?? ''
      // Add the line as empty first, then type each char
      timeouts.push(
        window.setTimeout(() => {
          if (cancelled) return
          setTyped((prev) => [...prev, ''])
        }, elapsed)
      )
      for (let ci = 1; ci <= line.length; ci++) {
        const snapshot = line.slice(0, ci)
        timeouts.push(
          window.setTimeout(() => {
            if (cancelled) return
            setTyped((prev) => {
              const next = prev.slice()
              next[li] = snapshot
              return next
            })
          }, elapsed + ci * CHAR_MS)
        )
      }
      elapsed += line.length * CHAR_MS + LINE_GAP_MS
    }

    // Hold on final screen briefly, then complete
    const holdT = window.setTimeout(complete, elapsed + 500)
    timeouts.push(holdT)

    const onKey = () => {
      // Skip: jump to complete. Snap to full log for a brief beat.
      setTyped(bootLog)
      setFlashDone(true)
      complete()
    }
    window.addEventListener('keydown', onKey, { once: true })

    return () => {
      cancelled = true
      timeouts.forEach((t) => window.clearTimeout(t))
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="fixed inset-0 bg-void font-mono text-text"
          style={{ zIndex: 90 }}
          role="presentation"
        >
          {/* CRT power-on flash: a hairline that snaps to fullscreen */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-text"
            initial={{ clipPath: 'inset(49.9% 0 49.9% 0)', opacity: 1 }}
            animate={
              flashDone
                ? { clipPath: 'inset(0% 0 0% 0)', opacity: 0 }
                : { clipPath: 'inset(49.9% 0 49.9% 0)', opacity: 1 }
            }
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          />
          <div
            className={cn(
              'crt-scanlines relative h-full w-full overflow-hidden px-6 pt-8 pb-10 sm:px-10 sm:pt-14'
            )}
          >
            <div className="mx-auto max-w-3xl text-[13px] leading-relaxed sm:text-sm">
              {typed.map((line, i) => {
                const isLast = i === typed.length - 1
                if (line === '') return <div key={i} className="h-5" />
                return (
                  <div key={i} className="whitespace-pre text-text">
                    {line}
                    {isLast ? <BlinkingCaret /> : null}
                  </div>
                )
              })}
              {typed.length === 0 ? <BlinkingCaret /> : null}
            </div>
            <div className="pointer-events-none absolute bottom-4 right-6 text-[11px] text-muted">
              [press any key to skip]
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function BlinkingCaret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block animate-pulse text-cyan"
      style={{ animationDuration: '0.9s' }}
    >
      _
    </span>
  )
}
