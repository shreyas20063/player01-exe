import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue } from 'framer-motion'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'
import type { Stat } from '@/types/profile'

function CountUp({ to, active, delay = 0 }: { to: number; active: boolean; delay?: number }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return
    const controls = animate(mv, to, {
      duration: 1.1,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [active, to, delay, mv])

  return <span className="tabular-nums">{String(display).padStart(2, '0')}</span>
}

function StatRow({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const segments = 15
  const fillRatio = stat.value / stat.max
  const delay = 0.2 + index * 0.12

  return (
    <div className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 font-mono text-xs">
      <div className="uppercase tracking-[0.18em] text-muted">{stat.label}</div>
      <div className="relative h-5 overflow-hidden border border-[color:var(--color-grid-line)] bg-void">
        {/* Segmented bar */}
        <div className="absolute inset-0 flex gap-px p-px">
          {Array.from({ length: segments }).map((_, i) => {
            const segActive = i / segments < fillRatio
            return (
              <motion.div
                key={i}
                className={cn(
                  'h-full flex-1',
                  segActive ? 'bg-magenta' : 'bg-[color:var(--color-grid-line)]/40'
                )}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={active ? { scaleY: 1, opacity: 1 } : undefined}
                transition={{
                  duration: 0.25,
                  delay: delay + i * 0.025,
                  ease: 'easeOut',
                }}
                style={{
                  boxShadow: segActive ? '0 0 6px rgba(255,45,107,0.6)' : 'none',
                  transformOrigin: 'bottom',
                }}
              />
            )
          })}
        </div>
        {/* Scanline overlay */}
        <div aria-hidden className="pointer-events-none absolute inset-0 crt-scanlines opacity-40" />
      </div>
      <div className="flex items-baseline gap-1 tabular-nums text-text">
        <CountUp to={stat.value} active={active} delay={delay} />
        <span className="text-muted">/</span>
        <span className="text-muted">{String(stat.max).padStart(2, '0')}</span>
      </div>
      <div className="col-span-3 -mt-1 text-[9px] uppercase tracking-widest text-dim">
        <span className="text-cyan">{'//'}</span> {stat.flavor}
      </div>
    </div>
  )
}

function WireframePortrait({ active }: { active: boolean }) {
  const pathTransition = (delay: number) => ({
    duration: 1.4,
    delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  })

  return (
    <svg
      viewBox="0 0 400 520"
      className="h-full max-h-[620px] w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="cs-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="cs-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1F1A38" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width={400} height={520} fill="url(#cs-grid)" opacity="0.6" />

      {/* Crosshair reticle */}
      <g stroke="#4AF8FF" strokeOpacity="0.25" strokeWidth="0.8">
        <line x1="0" y1="260" x2="400" y2="260" />
        <line x1="200" y1="0" x2="200" y2="520" />
        <circle cx="200" cy="260" r="160" fill="none" />
        <circle cx="200" cy="260" r="100" fill="none" />
      </g>

      <g
        stroke="#FF2D6B"
        strokeWidth="1.4"
        fill="none"
        filter="url(#cs-glow)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Skull/head outline — geometric */}
        <motion.path
          d="M 140 130 L 160 90 L 240 90 L 260 130 L 272 200 L 260 280 L 244 320 L 220 352 L 180 352 L 156 320 L 140 280 L 128 200 Z"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : undefined}
          transition={pathTransition(0.1)}
        />
        {/* Jaw */}
        <motion.path
          d="M 156 320 L 170 380 L 200 400 L 230 380 L 244 320"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : undefined}
          transition={pathTransition(0.3)}
        />
        {/* Eyes — triangular */}
        <motion.path
          d="M 150 200 L 186 190 L 178 218 Z"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : undefined}
          transition={pathTransition(0.55)}
        />
        <motion.path
          d="M 250 200 L 214 190 L 222 218 Z"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : undefined}
          transition={pathTransition(0.55)}
        />
        {/* Nose bridge */}
        <motion.path
          d="M 200 220 L 192 268 L 208 268 Z"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : undefined}
          transition={pathTransition(0.7)}
        />
        {/* Mouth line */}
        <motion.path
          d="M 176 310 L 200 318 L 224 310"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : undefined}
          transition={pathTransition(0.8)}
        />
        {/* Neck / shoulders */}
        <motion.path
          d="M 170 400 L 150 440 L 90 460 L 60 520 M 230 400 L 250 440 L 310 460 L 340 520"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : undefined}
          transition={pathTransition(0.95)}
        />
        {/* Cheek structural lines */}
        <motion.path
          d="M 140 230 L 172 260 M 260 230 L 228 260"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : undefined}
          transition={pathTransition(1.1)}
          stroke="#4AF8FF"
          strokeOpacity="0.6"
        />
      </g>

      {/* HUD corner brackets */}
      <g stroke="#4AF8FF" strokeWidth="1.2" fill="none">
        <path d="M 20 20 L 20 50 M 20 20 L 50 20" />
        <path d="M 380 20 L 380 50 M 380 20 L 350 20" />
        <path d="M 20 500 L 20 470 M 20 500 L 50 500" />
        <path d="M 380 500 L 380 470 M 380 500 L 350 500" />
      </g>

      {/* Labels */}
      <text
        x="200"
        y="40"
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.28em',
          fill: '#4AF8FF',
        }}
      >
        BIO-SCAN // ACTIVE
      </text>
      <text
        x="200"
        y="498"
        textAnchor="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.22em',
          fill: '#8A85A8',
        }}
      >
        SUBJECT: PLAYER_01
      </text>
    </svg>
  )
}

export function CharacterSelect() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-120px' })

  return (
    <section
      ref={sectionRef}
      id="character"
      className="relative min-h-[110vh] w-full overflow-hidden bg-void px-6 py-24 sm:px-10 lg:px-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-lines opacity-15" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(74,248,255,0.08), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-3">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
            <span className="inline-block h-px w-10 bg-cyan" />
            <span>PROFILE // SAVE_01</span>
          </div>
          <h2
            className="font-display text-5xl sm:text-6xl lg:text-[6rem] leading-none text-text"
            style={{ textShadow: '2px 0 var(--color-cyan), -2px 0 var(--color-magenta)' }}
          >
            CHARACTER_SELECT
          </h2>
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            <span className="text-magenta">{'//'}</span> {profile.role}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          {/* LEFT: Stat sheet */}
          <div className="relative border border-[color:var(--color-grid-line)] bg-surface/60 p-6 backdrop-blur-sm sm:p-8">
            <div aria-hidden className="pointer-events-none absolute inset-0 crt-scanlines opacity-30" />
            <div className="relative">
              <div className="mb-6 flex items-center justify-between border-b border-[color:var(--color-grid-line)] pb-4">
                <div>
                  <div className="font-display text-3xl leading-none text-text">
                    {profile.name}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                    @{profile.alias.toLowerCase()} — {profile.location}
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] uppercase tracking-widest">
                  <div className="text-cyan">RANK</div>
                  <div className="text-text">VIBE ARCHITECT</div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {profile.stats.map((stat, i) => (
                  <StatRow key={stat.label} stat={stat} index={i} active={inView} />
                ))}
              </div>

              <div className="mt-8 border-t border-[color:var(--color-grid-line)] pt-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-dim">
                  CLASS
                </div>
                <div className="mt-1 font-display text-xl text-amber">
                  CREATIVE TECHNOLOGIST
                </div>
                <p className="mt-3 max-w-prose font-body text-sm text-muted">
                  {profile.tagline}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest">
                <span className="border border-[color:var(--color-grid-line)] px-2 py-1 text-cyan">
                  AVAILABILITY: OPEN
                </span>
                <span className="border border-[color:var(--color-grid-line)] px-2 py-1 text-magenta">
                  LVL 09
                </span>
                <span className="border border-[color:var(--color-grid-line)] px-2 py-1 text-amber">
                  EST. 2014
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Portrait */}
          <div className="relative flex items-center justify-center border border-[color:var(--color-grid-line)] bg-surface/40 p-4 backdrop-blur-sm sm:p-6">
            <div aria-hidden className="pointer-events-none absolute inset-0 crt-scanlines opacity-30" />
            <div className="relative w-full">
              <WireframePortrait active={inView} />
              <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted">
                <span className="text-cyan">MESH: 248 VERTS</span>
                <span>RENDER: WIREFRAME_v2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
