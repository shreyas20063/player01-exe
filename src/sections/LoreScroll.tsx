import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'
import { useGameStore } from '@/store/useGameStore'
import { Divider } from '@/components/ui/Divider'

type LorePanel = {
  year: string
  title: string
  body: string
  glyph: string
  accent: 'magenta' | 'cyan' | 'amber'
}

const PANELS: LorePanel[] = [
  {
    year: '2014',
    title: 'A SMALL TOWN. A PENTIUM III.',
    body: 'A pirated copy of Flash MX on a beige tower. The modem screamed every night at 11. Built my first site for the town library — three pages, two gradients, one hit counter that lied.',
    glyph: '◢◤',
    accent: 'amber',
  },
  {
    year: '2018',
    title: 'FIRST JOB. FIRST DEPLOY. FIRST 3AM ROLLBACK.',
    body: 'A shared office above a laundromat. Learned that "ship it" and "ship it safely" are two different sports. Broke production on a Tuesday. Fixed it by Wednesday. Got a pizza out of it.',
    glyph: '▙▟',
    accent: 'cyan',
  },
  {
    year: '2021',
    title: 'QUIT TO SHIP THINGS THAT FEEL.',
    body: "Left the well-paying job to chase the thing I couldn't stop thinking about: why do some interfaces have body language and others feel like filling out a tax form. People paid attention. Then they paid money.",
    glyph: '◣◥',
    accent: 'magenta',
  },
  {
    year: '2026',
    title: 'STILL HERE. STILL SHIPPING. STILL WEIRD.',
    body: 'A Mission District apartment full of monitors. A design tokens compiler that outputs shader uniforms. A cat named Segfault. And a portfolio you are currently scrolling through.',
    glyph: '◆◇',
    accent: 'magenta',
  },
]

const ACCENT_TEXT: Record<LorePanel['accent'], string> = {
  magenta: 'text-magenta',
  cyan: 'text-cyan',
  amber: 'text-amber',
}

const ACCENT_BORDER: Record<LorePanel['accent'], string> = {
  magenta: 'border-magenta',
  cyan: 'border-cyan',
  amber: 'border-amber',
}

export function LoreScroll() {
  const reduced = useReducedMotion()
  const unlock = useGameStore((s) => s.unlock)
  const velocity = useScrollVelocity()
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-lore-panel]', section)

      panels.forEach((panel, i) => {
        const inner = panel.querySelector<HTMLElement>('[data-lore-inner]')
        if (inner) {
          gsap.fromTo(
            inner,
            {
              clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
              opacity: 0,
            },
            {
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              opacity: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        const bg = panel.querySelector<HTMLElement>('[data-lore-bg]')
        if (bg) {
          gsap.fromTo(
            bg,
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        }

        if (i === panels.length - 1) {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top 60%',
            onEnter: () => unlock('bibliophile'),
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced, unlock])

  // Velocity-reactive skew (capped)
  const skew = Math.max(-6, Math.min(6, velocity * 0.8))

  return (
    <section
      id="lore"
      ref={sectionRef}
      className="relative bg-void py-24 text-text"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Divider label="LOG FILE // ORIGIN.STORY" accent="cyan" />
        <h2 className="mt-6 font-display text-5xl uppercase leading-none tracking-tight md:text-7xl">
          LORE
          <span className="text-stroke-magenta"> // </span>
          <span className="text-muted">HOW WE GOT HERE</span>
        </h2>
      </div>

      <div className="mt-20 flex flex-col gap-16">
        {PANELS.map((panel, i) => (
          <article
            key={panel.year}
            data-lore-panel
            className="relative mx-auto flex min-h-[80vh] w-[92%] max-w-6xl items-stretch"
          >
            {/* Parallax background */}
            <div
              data-lore-bg
              aria-hidden
              className="absolute inset-0 overflow-hidden"
              style={{
                transform: `skewY(${skew * 0.3}deg)`,
              }}
            >
              <div
                className={`absolute inset-0 opacity-[0.12] ${ACCENT_TEXT[panel.accent]}`}
                style={{
                  backgroundImage: `repeating-linear-gradient(${i % 2 === 0 ? '45deg' : '-45deg'}, currentColor 0 1px, transparent 1px 24px)`,
                }}
              />
              <div
                className={`absolute -right-20 top-1/2 font-display text-[28vw] leading-none ${ACCENT_TEXT[panel.accent]} opacity-10`}
                style={{ transform: 'translateY(-50%)' }}
              >
                {panel.year}
              </div>
            </div>

            {/* Comic panel border */}
            <div
              data-lore-inner
              className="relative z-10 grid w-full grid-cols-1 gap-0 border-4 border-text bg-elev/80 shadow-[12px_12px_0_0_rgba(255,43,214,0.35)] backdrop-blur md:grid-cols-[1fr_2fr]"
              style={{
                transform: `skewY(${skew * 0.05}deg)`,
              }}
            >
              {/* Left: glyph + year */}
              <div
                className={`flex flex-col items-start justify-between border-b-4 border-text p-8 md:border-b-0 md:border-r-4 ${ACCENT_TEXT[panel.accent]}`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                  PANEL {String(i + 1).padStart(2, '0')} / 04
                </div>
                <div className="font-display text-[120px] leading-none md:text-[160px]">
                  {panel.glyph}
                </div>
                <div className="font-display text-5xl leading-none md:text-6xl">
                  {panel.year}
                </div>
              </div>

              {/* Right: title + body */}
              <div className="flex flex-col justify-center gap-6 p-10">
                <h3
                  className={`font-display text-3xl leading-tight md:text-5xl ${ACCENT_TEXT[panel.accent]}`}
                >
                  {panel.title}
                </h3>
                <p className="max-w-[60ch] font-body text-base leading-relaxed text-text/90 md:text-lg">
                  {panel.body}
                </p>
                <div
                  className={`mt-2 inline-flex items-center gap-2 self-start border ${ACCENT_BORDER[panel.accent]} px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] ${ACCENT_TEXT[panel.accent]}`}
                >
                  <span className="h-1.5 w-1.5 bg-current" />
                  SAVED TO DISK
                </div>
              </div>
            </div>

            {/* Corner tick marks */}
            <span
              aria-hidden
              className={`absolute -left-2 -top-2 z-20 h-4 w-4 border-l-2 border-t-2 ${ACCENT_BORDER[panel.accent]}`}
            />
            <span
              aria-hidden
              className={`absolute -bottom-2 -right-2 z-20 h-4 w-4 border-b-2 border-r-2 ${ACCENT_BORDER[panel.accent]}`}
            />
          </article>
        ))}
      </div>
    </section>
  )
}
