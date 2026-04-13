import { cn } from '@/lib/cn'

type DividerProps = {
  label?: string
  accent?: 'magenta' | 'cyan' | 'amber' | 'muted'
  className?: string
}

const ACCENT_TEXT: Record<NonNullable<DividerProps['accent']>, string> = {
  magenta: 'text-magenta',
  cyan: 'text-cyan',
  amber: 'text-amber',
  muted: 'text-muted',
}

export function Divider({
  label,
  accent = 'muted',
  className,
}: DividerProps) {
  const color = ACCENT_TEXT[accent]
  return (
    <div
      className={cn(
        'flex w-full items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em]',
        color,
        className
      )}
      role="separator"
      aria-label={label}
    >
      <span aria-hidden className="opacity-70">{'//'}</span>
      <span aria-hidden className="h-px flex-1 bg-current opacity-40" />
      {label ? (
        <span className="whitespace-nowrap opacity-90">{label}</span>
      ) : null}
      <span aria-hidden className="h-px flex-1 bg-current opacity-40" />
      <span aria-hidden className="opacity-70">{'//'}</span>
    </div>
  )
}
