import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'
import { achievements } from '@/data/achievements'

type ToastItem = {
  key: number
  id: string
  label: string
  xp: number
}

export function HUDAchievementToast() {
  const unlocked = useGameStore((s) => s.unlocked)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const prevRef = useRef<string[]>(unlocked)
  const counterRef = useRef(0)

  useEffect(() => {
    const prev = prevRef.current
    if (unlocked.length > prev.length) {
      const fresh = unlocked.filter((id) => !prev.includes(id))
      const next: ToastItem[] = []
      for (const id of fresh) {
        const ach = achievements.find((a) => a.id === id)
        if (!ach) continue
        counterRef.current += 1
        next.push({
          key: counterRef.current,
          id: ach.id,
          label: ach.label,
          xp: ach.xp,
        })
      }
      if (next.length > 0) {
        setToasts((curr) => [...curr, ...next])
      }
    }
    prevRef.current = unlocked
  }, [unlocked])

  useEffect(() => {
    if (toasts.length === 0) return undefined
    const timers = toasts.map((t) =>
      window.setTimeout(() => {
        setToasts((curr) => curr.filter((x) => x.key !== t.key))
      }, 3000)
    )
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [toasts])

  return (
    <div
      className="pointer-events-none fixed right-3 top-10 z-[52] flex w-[260px] flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.key}
            layout
            initial={{ x: 320, opacity: 0, filter: 'blur(6px)' }}
            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ x: 320, opacity: 0, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="relative border border-magenta bg-void/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-text backdrop-blur-sm sm:text-[11px]"
            style={{
              boxShadow: '0 0 16px #FF2D6B88, inset 0 0 12px #FF2D6B22',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-magenta">[ACHIEVEMENT_UNLOCKED]</span>
              <span className="text-amber">+{t.xp} XP</span>
            </div>
            <div className="mt-1 truncate text-[11px] text-cyan sm:text-[12px]">
              {t.label}
            </div>
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[1px] bg-magenta"
              initial={{ scaleX: 1, transformOrigin: 'left center' }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
