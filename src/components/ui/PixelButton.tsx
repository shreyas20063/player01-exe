import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Accent = 'magenta' | 'cyan'

type PixelButtonProps = {
  children: ReactNode
  accent?: Accent
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

const ACCENT_STYLES: Record<Accent, { color: string; shadow: string; hoverShadow: string }> = {
  magenta: {
    color: 'var(--color-magenta)',
    shadow:
      'inset 0 0 0 2px var(--color-magenta), 0 2px 0 0 var(--color-magenta), 4px 4px 0 0 rgba(255,45,107,0.35)',
    hoverShadow:
      'inset 0 0 0 2px var(--color-magenta), 0 2px 0 0 var(--color-magenta), 6px 6px 0 0 rgba(255,45,107,0.55), 0 0 24px rgba(255,45,107,0.5)',
  },
  cyan: {
    color: 'var(--color-cyan)',
    shadow:
      'inset 0 0 0 2px var(--color-cyan), 0 2px 0 0 var(--color-cyan), 4px 4px 0 0 rgba(74,248,255,0.35)',
    hoverShadow:
      'inset 0 0 0 2px var(--color-cyan), 0 2px 0 0 var(--color-cyan), 6px 6px 0 0 rgba(74,248,255,0.55), 0 0 24px rgba(74,248,255,0.5)',
  },
}

export function PixelButton({
  children,
  accent = 'magenta',
  className,
  onClick,
  type = 'button',
  ...rest
}: PixelButtonProps) {
  const style = ACCENT_STYLES[accent]
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'group relative inline-flex items-center justify-center',
        'px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.24em]',
        'bg-void/60 backdrop-blur-sm',
        'transition-all duration-150 ease-out will-change-transform',
        'hover:-translate-y-0.5 active:translate-y-px',
        'focus-visible:outline-none',
        className
      )}
      style={{
        color: style.color,
        boxShadow: style.shadow,
        clipPath:
          'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = style.hoverShadow
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = style.shadow
      }}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span aria-hidden className="text-[0.7em] opacity-70 group-hover:opacity-100">
          {'>'}
        </span>
        {children}
        <span aria-hidden className="text-[0.7em] opacity-0 transition-opacity group-hover:opacity-100">
          {'_'}
        </span>
      </span>
    </button>
  )
}
