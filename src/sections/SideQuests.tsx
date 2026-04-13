import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Divider } from '@/components/ui/Divider'
import { Tag } from '@/components/ui/Tag'

type Quest = {
  id: string
  kind: string
  title: string
  year: string
  blurb: string
  status: 'CLEARED' | 'ONGOING' | 'ARCHIVED' | '???'
  accent: 'magenta' | 'cyan' | 'amber'
  mysterious?: boolean
}

const QUESTS: Quest[] = [
  {
    id: 'q1',
    kind: 'WRITING',
    title: 'INTERFACES HAVE BODY LANGUAGE',
    year: '2024',
    blurb:
      'An essay on why some pages feel alive and others feel like tax forms. Read ~38K times, quoted in a Smashing Magazine editorial, printed on a Figma office wall.',
    status: 'CLEARED',
    accent: 'magenta',
  },
  {
    id: 'q2',
    kind: 'TALK',
    title: 'CSS IS A TIMING FUNCTION — CONFIG 2025',
    year: '2025',
    blurb:
      '22-minute talk on treating design tokens as choreography cues. Got a standing ovation from one person in the back row, which counts.',
    status: 'CLEARED',
    accent: 'cyan',
  },
  {
    id: 'q3',
    kind: 'OSS',
    title: 'EASE.TS — A PHYSICS-BASED ANIMATION LIB',
    year: '2022→',
    blurb:
      '~14K monthly npm installs. Zero dependencies. One maintainer who answers issues at 1am in pajamas.',
    status: 'ONGOING',
    accent: 'amber',
  },
  {
    id: 'q4',
    kind: 'EXPERIMENT',
    title: 'A CURSOR THAT REMEMBERS WHERE IT\'S BEEN',
    year: '2023',
    blurb:
      'A 200-line proof of concept that drew trails and learned your scroll habits. Never shipped. The GIFs did the rounds on Twitter for a week.',
    status: 'ARCHIVED',
    accent: 'magenta',
  },
  {
    id: 'q5',
    kind: 'WEIRD',
    title: 'THE BOOK OF UNREAD TOOLTIPS',
    year: '2024',
    blurb:
      'Zine project: 48 tooltips nobody has ever seen in production, printed risograph, sold 200 copies to UX people at a SF gallery pop-up.',
    status: 'CLEARED',
    accent: 'cyan',
  },
  {
    id: 'q6',
    kind: 'ADVISORY',
    title: 'DESIGN SYSTEMS @ 3 × SERIES B',
    year: '2023–25',
    blurb:
      'Three quiet engagements. Turned three different component libraries into things the engineers actually enjoyed using. NDAs mean no logos.',
    status: 'ONGOING',
    accent: 'amber',
  },
  {
    id: 'q7',
    kind: '???',
    title: '???',
    year: '????',
    blurb:
      'You found the seventh quest. It has no title yet. It will when it\'s ready. Come back later — it will have moved.',
    status: '???',
    accent: 'magenta',
    mysterious: true,
  },
]

const ACCENT_TEXT: Record<Quest['accent'], string> = {
  magenta: 'text-magenta',
  cyan: 'text-cyan',
  amber: 'text-amber',
}

const ACCENT_BORDER: Record<Quest['accent'], string> = {
  magenta: 'border-magenta/60',
  cyan: 'border-cyan/60',
  amber: 'border-amber/60',
}

export function SideQuests() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-quest]', section)
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            clipPath: 'inset(0 100% 0 0)',
            x: -30,
            opacity: 0,
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            x: 0,
            opacity: 1,
            duration: 0.9,
            delay: (i % 2) * 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="side-quests"
      ref={sectionRef}
      className="relative bg-void py-24 text-text"
    >
      <div className="mx-auto max-w-5xl px-6">
        <Divider label="OPTIONAL OBJECTIVES // SIDE QUESTS" accent="amber" />
        <h2 className="mt-6 font-display text-5xl uppercase leading-none tracking-tight md:text-7xl">
          SIDE
          <span className="text-amber"> QUESTS</span>
        </h2>
        <p className="mt-4 max-w-[60ch] font-body text-muted">
          Not main story. Still worth the XP. Mostly writing, open source, weird
          experiments, and the occasional zine nobody asked for.
        </p>

        <ol className="mt-16 flex flex-col gap-5">
          {QUESTS.map((q, i) => (
            <li
              key={q.id}
              data-quest
              className={[
                'relative grid grid-cols-[auto_1fr_auto] items-start gap-6 border bg-elev/40 p-5 backdrop-blur-sm md:p-7',
                q.mysterious
                  ? 'border-dashed border-muted/50 text-muted/80'
                  : `${ACCENT_BORDER[q.accent]}`,
              ].join(' ')}
            >
              {/* Quest number */}
              <div className="flex flex-col items-start font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                <span>QUEST</span>
                <span
                  className={`mt-1 font-display text-3xl leading-none ${q.mysterious ? 'text-muted/80' : ACCENT_TEXT[q.accent]}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Body */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag accent={q.mysterious ? 'magenta' : q.accent}>
                    {q.kind}
                  </Tag>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {q.year}
                  </span>
                </div>
                <h3
                  className={`mt-2 font-display text-xl uppercase leading-tight md:text-2xl ${q.mysterious ? 'text-muted' : 'text-text'}`}
                >
                  {q.title}
                </h3>
                <p className="mt-2 max-w-[72ch] font-body text-sm leading-relaxed text-muted">
                  {q.blurb}
                </p>
              </div>

              {/* Status badge */}
              <div className="hidden md:block">
                <span
                  className={[
                    'inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em]',
                    q.mysterious
                      ? 'border-dashed border-muted/60 text-muted'
                      : `${ACCENT_BORDER[q.accent]} ${ACCENT_TEXT[q.accent]}`,
                  ].join(' ')}
                >
                  <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
                  {q.status}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
