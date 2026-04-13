import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion'
import { arsenal } from '@/data/arsenal'
import { useMagnetic } from '@/hooks/useMagnetic'
import { useGameStore } from '@/store/useGameStore'
import { cn } from '@/lib/cn'
import type { ArsenalItem } from '@/types/arsenal'

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#$%&@ABCDEFGHJKMNPQRSTUVWXYZ0123456789'
const SCRAMBLE_DURATION_MS = 420

function scrambleText(target: string, progress: number): string {
  const len = target.length
  const revealed = Math.floor(progress * len)
  let out = ''
  for (let i = 0; i < len; i++) {
    if (i < revealed || target[i] === ' ' || target[i] === '.') {
      out += target[i]
    } else {
      out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    }
  }
  return out
}

type CardProps = {
  item: ArsenalItem
  index: number
  onFirstHover: (id: string) => void
}

function ArsenalCard({ item, index, onFirstHover }: CardProps) {
  const magneticRef = useMagnetic<HTMLDivElement>({ strength: 0.3, radius: 140 })
  const cardRef = useRef<HTMLDivElement | null>(null)
  const rotateXMV = useMotionValue(0)
  const rotateYMV = useMotionValue(0)
  const rotateX = useSpring(rotateXMV, { stiffness: 280, damping: 22, mass: 0.6 })
  const rotateY = useSpring(rotateYMV, { stiffness: 280, damping: 22, mass: 0.6 })
  const [displayName, setDisplayName] = useState(item.name)
  const [hovered, setHovered] = useState(false)
  const hoveredOnceRef = useRef(false)
  const scrambleRafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = cardRef.current
    if (el) {
      el.style.setProperty('--mx', '50%')
      el.style.setProperty('--my', '50%')
    }
    return () => {
      if (scrambleRafRef.current !== null) {
        cancelAnimationFrame(scrambleRafRef.current)
      }
    }
  }, [])

  const runScramble = useCallback(() => {
    if (scrambleRafRef.current !== null) {
      cancelAnimationFrame(scrambleRafRef.current)
    }
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / SCRAMBLE_DURATION_MS)
      setDisplayName(scrambleText(item.name, progress))
      if (progress < 1) {
        scrambleRafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayName(item.name)
        scrambleRafRef.current = null
      }
    }
    scrambleRafRef.current = requestAnimationFrame(tick)
  }, [item.name])

  const handlePointerEnter = useCallback(() => {
    setHovered(true)
    runScramble()
    if (!hoveredOnceRef.current) {
      hoveredOnceRef.current = true
      onFirstHover(item.id)
    }
  }, [runScramble, onFirstHover, item.id])

  const handlePointerLeave = useCallback(() => {
    setHovered(false)
    rotateXMV.set(0)
    rotateYMV.set(0)
    const el = cardRef.current
    if (el) {
      el.style.setProperty('--mx', '50%')
      el.style.setProperty('--my', '50%')
    }
  }, [rotateXMV, rotateYMV])

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width // 0..1
      const relY = (e.clientY - rect.top) / rect.height // 0..1
      const nx = relX * 2 - 1 // -1..1
      const ny = relY * 2 - 1 // -1..1
      // Tilt: mouse at top -> rotateX positive (card tips back toward camera-top)
      rotateXMV.set(-ny * 12)
      rotateYMV.set(nx * 12)
      el.style.setProperty('--mx', `${relX * 100}%`)
      el.style.setProperty('--my', `${relY * 100}%`)
    },
    [rotateXMV, rotateYMV]
  )

  return (
    <motion.div
      ref={magneticRef}
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        ref={cardRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 900,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'group relative block h-full cursor-none select-none',
          'bg-surface/80 backdrop-blur-sm',
          'border border-[color:var(--color-grid-line)]',
          'p-4 sm:p-5',
          'will-change-transform'
        )}
      >
        {/* Radial glow following cursor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(200% 200% at var(--mx) var(--my), rgba(255,45,107,0.25) 0%, rgba(255,45,107,0.08) 28%, transparent 55%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Scanlines overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 crt-scanlines opacity-40"
        />

        {/* RGB border glitch — 3 stacked borders offset on hover */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 border border-[#ff2d6b] transition-transform duration-200',
            hovered ? 'translate-x-[-2px] translate-y-[-1px]' : ''
          )}
          style={{ mixBlendMode: 'screen' }}
        />
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 border border-[#4af8ff] transition-transform duration-200',
            hovered ? 'translate-x-[2px] translate-y-[1px]' : ''
          )}
          style={{ mixBlendMode: 'screen' }}
        />
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 border border-[#c6ff3d] transition-transform duration-200',
            hovered ? 'translate-y-[2px]' : ''
          )}
          style={{ mixBlendMode: 'screen', opacity: 0.7 }}
        />

        {/* Corner ticks */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t transition-colors',
            hovered ? 'border-magenta' : 'border-muted/60'
          )}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t transition-colors',
            hovered ? 'border-magenta' : 'border-muted/60'
          )}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l transition-colors',
            hovered ? 'border-magenta' : 'border-muted/60'
          )}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r transition-colors',
            hovered ? 'border-magenta' : 'border-muted/60'
          )}
        />

        {/* Card content */}
        <div className="relative z-10 flex h-full flex-col gap-3" style={{ transform: 'translateZ(24px)' }}>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
            <span className="text-cyan">SLOT_{item.slot}</span>
            <span
              className={cn(
                'px-1.5 py-0.5 border',
                item.kind === 'weapon' && 'border-magenta/60 text-magenta',
                item.kind === 'tool' && 'border-cyan/60 text-cyan',
                item.kind === 'shader' && 'border-amber/60 text-amber',
                item.kind === 'kit' && 'border-[color:var(--color-lime)]/60 text-[color:var(--color-lime)]'
              )}
            >
              {item.kind}
            </span>
          </div>

          <div className="min-h-[3.25rem]">
            <div
              className="font-display text-2xl sm:text-[1.6rem] leading-none text-text"
              style={{
                textShadow: hovered
                  ? '2px 0 var(--color-cyan), -2px 0 var(--color-magenta)'
                  : 'none',
              }}
            >
              {displayName}
            </div>
          </div>

          <div className="mt-auto space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
              <span>MASTERY</span>
              <span className="text-text tabular-nums">{item.mastery}%</span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden bg-[color:var(--color-grid-line)]">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: item.mastery / 100 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.9,
                  delay: 0.1 + index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-magenta via-[#ff6b9a] to-cyan"
                style={{ boxShadow: hovered ? '0 0 12px var(--color-magenta)' : 'none' }}
              />
            </div>
            <div className="flex gap-px font-mono text-[8px] text-muted/70">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i}>{i / 12 < item.mastery / 100 ? '█' : '░'}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ArsenalSection() {
  const unlock = useGameStore((s) => s.unlock)
  const hoveredSet = useRef<Set<string>>(new Set())
  const firedAllRef = useRef(false)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' })

  const handleFirstHover = useCallback(
    (id: string) => {
      if (hoveredSet.current.size === 0) {
        unlock('first_blood')
      }
      hoveredSet.current.add(id)
      if (!firedAllRef.current && hoveredSet.current.size >= arsenal.length) {
        firedAllRef.current = true
        unlock('arsenal_master')
      }
    },
    [unlock]
  )

  const items = useMemo(() => arsenal, [])

  return (
    <section
      id="arsenal"
      className="relative min-h-[120vh] w-full overflow-hidden bg-void px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* Background grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-lines opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,45,107,0.08), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-14 flex flex-col gap-3">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
            <span className="inline-block h-px w-10 bg-cyan" />
            <span>PLAYER_01 // LOADOUT</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={headerInView ? { opacity: 1, letterSpacing: '0.01em' } : undefined}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl sm:text-7xl lg:text-[7rem] leading-none text-text"
            style={{ textShadow: '3px 0 var(--color-cyan), -3px 0 var(--color-magenta)' }}
          >
            ARSENAL
          </motion.h2>
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted">
            <span className="text-magenta">{'//'}</span>
            <span>12 WEAPONS EQUIPPED</span>
            <span className="ml-auto hidden text-dim sm:inline">[ HOVER TO INSPECT ]</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {items.map((item, i) => (
            <ArsenalCard key={item.id} item={item} index={i} onFirstHover={handleFirstHover} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-grid-line)] pt-6 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span>EQUIPPED: 12 / 12</span>
          <span className="text-cyan">AVG MASTERY: {Math.round(
            items.reduce((a, b) => a + b.mastery, 0) / items.length
          )}%</span>
          <span className="text-magenta">STATUS: READY</span>
        </div>
      </div>
    </section>
  )
}
