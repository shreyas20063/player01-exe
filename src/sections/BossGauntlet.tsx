import { Suspense, useLayoutEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { projects } from '@/data/projects'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useGameStore } from '@/store/useGameStore'
import { Tag } from '@/components/ui/Tag'
import { Divider } from '@/components/ui/Divider'
import { BossShape } from '@/three/BossShape'
import type { Project } from '@/types/project'

const ACCENT_HEX: Record<Project['accent'], string> = {
  magenta: '#ff2bd6',
  cyan: '#22f7ff',
  amber: '#ffb400',
}

const ACCENT_TEXT: Record<Project['accent'], string> = {
  magenta: 'text-magenta',
  cyan: 'text-cyan',
  amber: 'text-amber',
}


const ACCENT_BORDER: Record<Project['accent'], string> = {
  magenta: 'border-magenta/50',
  cyan: 'border-cyan/50',
  amber: 'border-amber/50',
}

export function BossGauntlet() {
  const reduced = useReducedMotion()
  const unlock = useGameStore((s) => s.unlock)

  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-boss-panel]', track)
      if (panels.length === 0) return

      const getDistance = () =>
        -(track.scrollWidth - window.innerWidth)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + window.innerWidth * (panels.length - 0.1),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(track, {
        x: getDistance,
        ease: 'none',
      })

      // Parallax splash inside each panel
      panels.forEach((panel) => {
        const splash = panel.querySelector<HTMLElement>('[data-splash]')
        const copy = panel.querySelector<HTMLElement>('[data-copy]')
        if (splash) {
          gsap.fromTo(
            splash,
            { xPercent: 12, scale: 1.05 },
            {
              xPercent: -12,
              scale: 0.98,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
        }
        if (copy) {
          gsap.fromTo(
            copy,
            { xPercent: -4, opacity: 0.4 },
            {
              xPercent: 4,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
        }
      })

      // Final panel achievement trigger
      const lastPanel = panels[panels.length - 1]
      if (lastPanel) {
        ScrollTrigger.create({
          trigger: lastPanel,
          containerAnimation: tl,
          start: 'left center',
          onEnter: () => unlock('boss_hunter'),
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced, unlock])

  if (reduced) {
    return (
      <section
        id="bosses"
        ref={sectionRef}
        className="relative bg-void text-text"
      >
        <div className="mx-auto max-w-5xl px-6 py-24">
          <Divider label="SECTOR 03 // BOSS GAUNTLET" accent="magenta" />
          <h2 className="mt-6 font-display text-5xl uppercase tracking-tight">
            BOSS GAUNTLET
          </h2>
          <div className="mt-16 flex flex-col gap-24">
            {projects.map((p) => (
              <BossCardStatic key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="bosses"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-void text-text"
      aria-label="Boss Gauntlet"
    >
      {/* Fixed HUD overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse bg-magenta" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            SECTOR 03 // BOSS GAUNTLET
          </span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          SCROLL <span className="text-text">▶</span> ENGAGE
        </div>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="relative flex h-full will-change-transform"
        style={{ width: `${projects.length * 100}vw` }}
      >
        {projects.map((project, idx) => (
          <BossPanel
            key={project.id}
            project={project}
            index={idx}
            total={projects.length}
          />
        ))}
      </div>

      {/* Bottom progress bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[2px] bg-surface">
        <div
          className="h-full bg-gradient-to-r from-magenta via-cyan to-amber"
          style={{ width: '100%' }}
        />
      </div>
    </section>
  )
}

type BossPanelProps = {
  project: Project
  index: number
  total: number
}

function BossPanel({ project, index, total }: BossPanelProps) {
  const hex = ACCENT_HEX[project.accent]
  const isMobile = useIsMobile()

  return (
    <article
      data-boss-panel
      className="relative flex h-full w-screen shrink-0 items-center"
      style={{ clipPath: 'inset(-200% 0 -200% -200%)' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(${hex} 1px, transparent 1px), linear-gradient(90deg, ${hex} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Scanlines */}
      <div className="crt-scanlines pointer-events-none absolute inset-0 opacity-30" />

      {/* 3D morphing shape — extra-wide Canvas so the left hemisphere has room */}
      <div
        data-splash
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{ right: '-55vw', width: '160vh', height: '120vh' }}
      >
        {!isMobile ? (
          <Canvas
            dpr={[1, 1.5]}
            frameloop="always"
            gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 3.8], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <BossShape accent={project.accent} />
            </Suspense>
          </Canvas>
        ) : (
          <div
            className="h-full w-full rounded-full opacity-40"
            style={{
              background: `radial-gradient(circle, ${hex} 0%, transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* Huge boss number (stroke) top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-6 top-[14vh] font-display uppercase leading-[0.8] text-transparent"
        style={{
          WebkitTextStroke: `1px ${hex}`,
          fontSize: 'clamp(140px, 14vw, 220px)',
          letterSpacing: '-0.04em',
          opacity: 0.9,
        }}
      >
        {project.number}
      </div>

      {/* Copy */}
      <div
        data-copy
        className="relative z-10 ml-[7vw] mr-[45vw] mt-[14vh] max-w-[58ch]"
      >
        <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          <span className={ACCENT_TEXT[project.accent]}>◆</span>
          <span>TARGET {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
          <span className="text-stroke-magenta">·</span>
          <span>{project.year}</span>
          <span className="text-stroke-magenta">·</span>
          <span>{project.role}</span>
        </div>

        <h3
          className={`font-display leading-[0.85] tracking-tight ${ACCENT_TEXT[project.accent]}`}
          style={{ fontSize: 'clamp(56px, 7vw, 110px)' }}
        >
          {project.title}
        </h3>

        <p className="mt-5 font-body italic text-muted text-xl">
          &ldquo;{project.tagline}&rdquo;
        </p>

        <p className="mt-5 max-w-[60ch] font-body text-sm leading-relaxed text-text/90">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Tag key={tech} accent={project.accent}>
              {tech}
            </Tag>
          ))}
        </div>

        <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className={`border ${ACCENT_BORDER[project.accent]} bg-elev/60 px-4 py-3 backdrop-blur-sm`}
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                {m.label}
              </div>
              <div
                className={`mt-1 font-display text-3xl leading-none ${ACCENT_TEXT[project.accent]}`}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {(project.links.live || project.links.repo) && (
          <div className="mt-8 flex gap-4 font-mono text-xs uppercase tracking-[0.2em]">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className={`border border-current px-4 py-2 ${ACCENT_TEXT[project.accent]} hover:bg-current hover:text-void transition-colors`}
              >
                [ ENGAGE ▶ ]
              </a>
            )}
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="border border-muted px-4 py-2 text-muted hover:border-text hover:text-text transition-colors"
              >
                [ INSPECT SRC ]
              </a>
            )}
          </div>
        )}
      </div>

      {/* VS splash divider (between panels) */}
      {index < total - 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-1/2 z-10 -translate-y-1/2"
        >
          <div className="font-display text-6xl text-stroke-magenta opacity-40">
            VS
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            NEXT BOSS ▶
          </div>
        </div>
      )}

      {/* Panel index marker (bottom-left) */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-10 flex items-end gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        <span>{'//'} PANEL</span>
        <span className="text-text">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </article>
  )
}

function BossCardStatic({ project }: { project: Project }) {
  return (
    <article
      className={`relative border ${ACCENT_BORDER[project.accent]} bg-elev/40 p-8`}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {project.number} · {project.year} · {project.role}
      </div>
      <h3
        className={`mt-3 font-display text-5xl leading-none ${ACCENT_TEXT[project.accent]}`}
      >
        {project.title}
      </h3>
      <p className="mt-4 font-body italic text-muted">
        &ldquo;{project.tagline}&rdquo;
      </p>
      <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-text/90">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((t) => (
          <Tag key={t} accent={project.accent}>
            {t}
          </Tag>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {project.metrics.map((m) => (
          <div
            key={m.label}
            className={`border ${ACCENT_BORDER[project.accent]} bg-void/40 px-4 py-3`}
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
              {m.label}
            </div>
            <div
              className={`mt-1 font-display text-2xl ${ACCENT_TEXT[project.accent]}`}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
