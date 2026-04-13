import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/data/profile'

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________'
const ROLE_LINES = [
  profile.role,
  'PLAYER_01',
  'SHIPPED 47 LEVELS',
  'BASED IN SF.exe',
]

/**
 * Cheap inline scramble effect. Progressively reveals the target string
 * by resolving one character at a time while the rest flicker randomly.
 */
function useScramble(target: string, duration = 700) {
  const [out, setOut] = useState(target)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = out
    const max = Math.max(target.length, from.length)
    const queue: { from: string; to: string; start: number; end: number }[] = []
    for (let i = 0; i < max; i++) {
      const fromChar = from[i] ?? ''
      const toChar = target[i] ?? ''
      const begin = Math.floor(Math.random() * 40)
      const end = begin + Math.floor(Math.random() * 40) + 10
      queue.push({ from: fromChar, to: toChar, start: begin, end })
    }
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / duration)
      const frame = Math.floor(progress * 60)
      let next = ''
      let done = 0
      for (const q of queue) {
        if (frame >= q.end) {
          next += q.to
          done++
        } else if (frame >= q.start) {
          next += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        } else {
          next += q.from
        }
      }
      setOut(next)
      if (done < queue.length) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])
  return out
}

function RoleTicker() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % ROLE_LINES.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [])
  const scrambled = useScramble(ROLE_LINES[idx] ?? '', 650)
  return (
    <span className="inline-block min-h-[1.2em] text-cyan">
      <span className="text-magenta">&gt;</span> {scrambled}
      <span className="ml-1 inline-block h-[1em] w-[0.6ch] translate-y-[2px] animate-pulse bg-cyan" />
    </span>
  )
}

export function HeroSection() {
  const bio = profile.bio[0] ?? ''
  const letters = useMemo(() => profile.name.split(''), [])

  return (
    <section
      id="hero"
      className="relative min-h-[140vh] w-full overflow-hidden bg-void text-text"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-[0.22]" />
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-40 mix-blend-overlay" />

      {/* Radial vignette gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(255,45,107,0.10), transparent 60%)',
        }}
      />

      {/* Status chrome — top corners */}
      <div className="pointer-events-none absolute left-6 top-6 z-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-magenta shadow-[0_0_12px_#FF2D6B]" />
        <span className="text-magenta">REC</span>
        <span>PLAYER_01.exe</span>
        <span className="opacity-50">// v9.14.0</span>
      </div>
      <div className="pointer-events-none absolute right-6 top-6 z-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <span className="text-cyan">ONLINE</span> · {profile.location.toUpperCase()}
      </div>

      {/* Content — the 3D rock lives in a separate fixed Canvas via App.tsx */}
      <div className="relative z-[2] mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pt-24 md:px-12">
        {/* Micro-label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-muted"
        >
          <span className="h-px w-10 bg-magenta" />
          <span>SCROLL TO BEGIN // PLAYER_01.exe</span>
        </motion.div>

        {/* KAI RIOS — the brutalist headline */}
        <h1
          className="font-display relative select-none leading-[0.82] tracking-[-0.03em]"
          style={{
            fontSize: 'clamp(5rem, 15vw, 12.5rem)',
            fontWeight: 900,
          }}
          aria-label={profile.name}
        >
          <span className="relative inline-block">
            {/* Magenta offset ghost */}
            <span
              aria-hidden
              className="absolute inset-0 text-magenta"
              style={{ transform: 'translate(6px, 6px)', opacity: 0.7 }}
            >
              {profile.name}
            </span>
            {/* Cyan offset ghost */}
            <span
              aria-hidden
              className="absolute inset-0 text-cyan"
              style={{ transform: 'translate(-5px, -3px)', opacity: 0.55 }}
            >
              {profile.name}
            </span>
            {/* Main stroke */}
            <span
              className="relative text-transparent"
              style={{
                WebkitTextStroke: '2px #F5F3FF',
              }}
            >
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, rotateX: -60 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.2 + i * 0.04,
                    ease: [0.2, 0.9, 0.2, 1],
                  }}
                  className="inline-block"
                >
                  {l === ' ' ? '\u00A0' : l}
                </motion.span>
              ))}
            </span>
          </span>
        </h1>

        {/* Role scramble line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 font-mono text-sm uppercase tracking-[0.24em] md:text-base"
        >
          <RoleTicker />
        </motion.div>

        {/* Bio paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="font-body mt-10 max-w-[60ch] text-[15px] leading-[1.7] text-muted md:text-[16px]"
        >
          {bio}
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.35 }}
          className="mt-12 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em]"
        >
          <a
            href="#character"
            className="group relative inline-flex items-center gap-3 border border-magenta/60 bg-magenta/10 px-5 py-3 text-magenta transition hover:bg-magenta/25 glow-magenta"
          >
            <span>▶ START GAME</span>
            <span className="opacity-50 transition group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-3 border border-cyan/40 px-5 py-3 text-cyan transition hover:bg-cyan/10 glow-cyan"
          >
            <span>◆ HIRE PLAYER_01</span>
          </a>
          <span className="ml-2 text-muted">
            <span className="text-amber">★</span> {profile.availability}
          </span>
        </motion.div>
      </div>

      {/* Scroll hint pinned to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.8 }}
        className="absolute bottom-10 left-1/2 z-[2] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-muted"
      >
        <div className="flex flex-col items-center gap-2">
          <span>SCROLL TO ENTER</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-6 w-px bg-cyan"
          />
        </div>
      </motion.div>
    </section>
  )
}
