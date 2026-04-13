import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type TagAccent = 'magenta' | 'cyan' | 'amber'

type TagProps = {
  children: ReactNode
  accent?: TagAccent
  className?: string
}

const ACCENT_STYLES: Record<TagAccent, string> = {
  magenta:
    'border-magenta/60 text-magenta shadow-[0_0_12px_-4px_rgba(255,0,170,0.8)]',
  cyan: 'border-cyan/60 text-cyan shadow-[0_0_12px_-4px_rgba(0,255,255,0.8)]',
  amber:
    'border-amber/60 text-amber shadow-[0_0_12px_-4px_rgba(255,176,0,0.8)]',
}

export function Tag({ children, accent = 'cyan', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-2.5 py-1',
        'font-mono text-[10px] uppercase tracking-[0.18em]',
        'bg-void/40 backdrop-blur-sm',
        'transition-colors duration-200',
        ACCENT_STYLES[accent],
        className
      )}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
      {children}
    </span>
  )
}
