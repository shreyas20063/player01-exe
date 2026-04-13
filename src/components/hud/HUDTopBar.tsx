import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { useMousePosition } from '@/hooks/useMousePosition'

function pad(n: number, width: number): string {
  const s = String(Math.max(0, Math.floor(n)))
  return s.length >= width ? s : '0'.repeat(width - s.length) + s
}

function formatSFTime(date: Date): string {
  // America/Los_Angeles, 24-hour, HH:MM:SS
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Los_Angeles',
  })
  return `${fmt.format(date)} PT`
}

export function HUDTopBar() {
  const level = useGameStore((s) => s.level)
  const { x, y } = useMousePosition()
  const [now, setNow] = useState<string>(() => formatSFTime(new Date()))

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(formatSFTime(new Date()))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 flex items-center justify-between gap-4 border-b border-muted/30 bg-void/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted backdrop-blur-sm sm:text-[11px]"
      role="presentation"
    >
      <div className="flex min-w-0 items-center gap-2 truncate">
        <span className="text-magenta">PLAYER_01</span>
        <span className="text-dim">—</span>
        <span className="text-text">KAI RIOS</span>
        <span className="ml-2 hidden text-cyan sm:inline">LV.{pad(level, 2)}</span>
      </div>

      <div className="hidden items-center gap-2 text-cyan md:flex">
        <span className="text-dim">POS</span>
        <span className="tabular-nums">
          [{pad(x, 4)},{pad(y, 4)}]
        </span>
      </div>

      <div className="flex items-center gap-2 text-amber">
        <span className="text-dim">SF</span>
        <span className="tabular-nums">{now}</span>
      </div>
    </div>
  )
}
