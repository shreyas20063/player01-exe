import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { profile } from '@/data/profile'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Divider } from '@/components/ui/Divider'

type CreditLine = {
  role: string
  name: string
}

const CREDITS: CreditLine[] = [
  { role: 'DIRECTED BY', name: 'KAI RIOS' },
  { role: 'CINEMATOGRAPHY', name: 'THREE.JS' },
  { role: 'SCORE', name: 'LO-FI HIP HOP RADIO (24/7 STREAM)' },
  { role: 'LEAD DEV', name: 'KAI RIOS' },
  { role: 'TEXT LAYOUT', name: '@CHENGLOU / PRETEXT' },
  { role: 'MOTION', name: 'GSAP + FRAMER MOTION' },
  { role: 'BUILD TOOLING', name: 'VITE + TYPESCRIPT' },
  { role: 'CATERING', name: 'PHILZ COFFEE' },
  { role: 'GAFFER', name: 'A SINGLE RIM LIGHT' },
  { role: 'KEY GRIP', name: 'SEGFAULT THE CAT' },
  { role: 'QA', name: 'THREE PEOPLE IN A DISCORD' },
  { role: 'PROOFREADING', name: 'GRAMMARLY (AND FAILING)' },
  { role: 'MADE IN', name: 'SAN FRANCISCO, CA' },
  { role: 'YEAR', name: '2026' },
  { role: 'SPECIAL THANKS', name: 'YOU, FOR SCROLLING THIS FAR' },
]

export function CreditsRoll() {
  const reduced = useReducedMotion()
  const footerRef = useRef<HTMLElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const footer = footerRef.current
    const inner = innerRef.current
    if (!footer || !inner) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: 20 },
        {
          yPercent: -95,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      )
    }, footerRef)

    return () => ctx.revert()
  }, [reduced])

  // Listen for [R] to restart
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      if (e.key === 'r' || e.key === 'R') {
        window.location.reload()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <footer
      id="credits"
      ref={footerRef}
      className="relative h-[120vh] overflow-hidden bg-void text-text"
      aria-label="Credits"
    >
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-void to-transparent" />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-void to-transparent" />

      {/* Scanlines */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 opacity-40" />

      {/* Starfield hint */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.7) 1px, transparent 1px), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.5) 1px, transparent 1px), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '300px 300px, 200px 200px, 400px 400px',
        }}
      />

      <div
        ref={innerRef}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-10 px-6 py-[40vh] text-center"
      >
        <Divider label="END OF LINE" accent="magenta" />

        <h2 className="font-display text-6xl uppercase leading-none tracking-tight md:text-8xl">
          PLAYER_01
          <span className="text-stroke-magenta">.EXE</span>
        </h2>

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          CREDITS ROLL // SCRUB TO ADVANCE
        </p>

        <div className="mt-6 flex w-full flex-col gap-4 font-mono text-sm uppercase tracking-[0.12em]">
          {CREDITS.map((line) => (
            <div
              key={line.role + line.name}
              className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4"
            >
              <span className="text-right text-muted">{line.role}</span>
              <span className="text-muted">......</span>
              <span className="text-left text-text">{line.name}</span>
            </div>
          ))}
        </div>

        {/* Contact block */}
        <div className="mt-10 w-full">
          <Divider label="CONTACT" accent="cyan" />
          <div className="mt-6 flex flex-col gap-3 font-mono text-sm uppercase tracking-[0.12em]">
            {profile.socials.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4"
              >
                <span className="text-right text-muted">{s.label}</span>
                <span className="text-muted">......</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-left text-cyan hover:text-magenta transition-colors"
                >
                  {s.handle}
                </a>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4">
              <span className="text-right text-muted">EMAIL</span>
              <span className="text-muted">......</span>
              <a
                href={`mailto:${profile.email}`}
                className="text-left text-cyan hover:text-magenta transition-colors"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </div>

        {/* Sign-off */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="font-display text-4xl uppercase leading-none tracking-tight text-magenta md:text-6xl glow-magenta">
            THANKS FOR PLAYING.
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            A PLAYER_01 PRODUCTION · {profile.location}
          </div>
          <div className="mt-4 inline-flex items-center gap-3 border border-magenta/70 bg-void/60 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-magenta glow-magenta">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse bg-magenta" />
            PRESS
            <kbd className="border border-magenta/80 bg-elev px-2 py-0.5 text-magenta">
              R
            </kbd>
            TO RESTART
          </div>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            {'//'} EOF {'//'}
          </div>
        </div>
      </div>
    </footer>
  )
}
