import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'
import { cn } from '@/lib/cn'

export function HUDXPBar() {
  const xp = useGameStore((s) => s.xp)
  const level = useGameStore((s) => s.level)
  const rank = useGameStore((s) => s.rank)

  const levelFloor = (level - 1) * 250
  const levelCap = level * 250
  const within = Math.max(0, xp - levelFloor)
  const span = Math.max(1, levelCap - levelFloor)
  const pct = Math.max(0, Math.min(100, (within / span) * 100))

  const [pulse, setPulse] = useState(false)
  const prev = useRef(xp)
  useEffect(() => {
    if (xp > prev.current) {
      setPulse(true)
      const t = window.setTimeout(() => setPulse(false), 900)
      prev.current = xp
      return () => window.clearTimeout(t)
    }
    prev.current = xp
    return undefined
  }, [xp])

  return (
    <div
      className={cn(
        'pointer-events-none fixed bottom-3 left-3 w-[240px] select-none border border-muted/30 bg-void/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text backdrop-blur-sm sm:w-[260px] sm:text-[11px]',
        pulse && 'border-magenta shadow-neon-magenta'
      )}
      style={{
        boxShadow: pulse
          ? '0 0 24px #FF2D6B, 0 0 48px #FF2D6B55'
          : '0 0 0 transparent',
        transition: 'box-shadow 0.6s ease-out, border-color 0.6s ease-out',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-magenta">[{rank}]</span>
        <span className="text-dim">LV.{String(level).padStart(2, '0')}</span>
      </div>

      <div className="mt-1.5 h-1.5 w-full overflow-hidden border border-muted/30 bg-surface">
        <motion.div
          className="h-full bg-magenta"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
          style={{
            boxShadow: '0 0 10px #FF2D6B, 0 0 20px #FF2D6B88',
          }}
        />
      </div>

      <div className="mt-1 flex items-center justify-between text-[9px] text-muted sm:text-[10px]">
        <span className="text-dim">XP</span>
        <span className="tabular-nums text-cyan">
          {String(within).padStart(3, '0')}/{String(span).padStart(3, '0')}
        </span>
      </div>
    </div>
  )
}
