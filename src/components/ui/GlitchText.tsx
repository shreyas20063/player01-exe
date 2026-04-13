import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type GlitchTextProps = {
  children: ReactNode
  as?: 'h1' | 'h2' | 'span'
  className?: string
  dataText?: string
}

export function GlitchText({
  children,
  as = 'span',
  className,
  dataText,
}: GlitchTextProps) {
  const Tag = as
  const text = dataText ?? (typeof children === 'string' ? children : undefined)
  return (
    <Tag
      data-text={text}
      className={cn('glitch-text relative inline-block', className)}
    >
      {children}
    </Tag>
  )
}

// CSS injected once for glitch effect. Uses data-text on the element to
// render the two clones via ::before/::after without duplicating children.
const STYLE_ID = 'glitch-text-style'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.appendChild(
    document.createTextNode(`
.glitch-text { position: relative; }
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: transparent;
  overflow: hidden;
}
.glitch-text::before {
  color: var(--color-cyan);
  transform: translate(-2px, 0);
  clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  mix-blend-mode: screen;
  animation: glitch-top 2.4s steps(1) infinite;
}
.glitch-text::after {
  color: var(--color-magenta);
  transform: translate(2px, 0);
  clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%);
  mix-blend-mode: screen;
  animation: glitch-bot 3.1s steps(1) infinite;
}
@keyframes glitch-top {
  0%, 94%, 100% { clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%); transform: translate(-2px, 0); }
  95% { clip-path: polygon(0 10%, 100% 10%, 100% 28%, 0 28%); transform: translate(-4px, 1px); }
  97% { clip-path: polygon(0 2%, 100% 2%, 100% 44%, 0 44%); transform: translate(3px, -1px); }
}
@keyframes glitch-bot {
  0%, 92%, 100% { clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%); transform: translate(2px, 0); }
  93% { clip-path: polygon(0 72%, 100% 72%, 100% 92%, 0 92%); transform: translate(4px, 1px); }
  96% { clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); transform: translate(-3px, 2px); }
}
`)
  )
  document.head.appendChild(style)
}
