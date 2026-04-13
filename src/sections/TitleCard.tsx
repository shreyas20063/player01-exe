import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'

const PLAYER = 'PLAYER_01'

export function TitleCard() {
  const marquee = projects.map((p) => p.title).join('   //   ')
  return (
    <section
      id="title"
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-void px-6 py-20 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-20" />
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-muted sm:text-sm"
      >
        {profile.alias} // {profile.role}
      </motion.div>

      <RgbTitle text={PLAYER} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 font-mono text-sm uppercase tracking-[0.3em] text-amber sm:text-base"
        style={{
          animation: 'scroll-hint-pulse 0.833s steps(2, end) infinite',
        }}
      >
        &gt; SCROLL TO ENTER
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-10 w-full max-w-4xl"
      >
        <div className="mb-2 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
          <span className="h-px w-10 bg-muted/40" />
          <span>attract mode</span>
          <span className="h-px w-10 bg-muted/40" />
        </div>
        <div className="relative overflow-hidden border border-grid-line/60 bg-surface/40 py-2">
          <div
            className="whitespace-nowrap font-mono text-xs text-cyan sm:text-sm"
            style={{
              animation: 'title-marquee 22s linear infinite',
              display: 'inline-block',
              paddingLeft: '100%',
            }}
          >
            {marquee}   //   {marquee}
          </div>
        </div>
      </motion.div>

      <TitleStyles />
    </section>
  )
}

function RgbTitle({ text }: { text: string }) {
  return (
    <div className="relative mt-6 select-none leading-[0.85]">
      <h1
        className={cn(
          'font-display text-[clamp(5rem,18vw,18rem)] font-black uppercase tracking-tight text-text'
        )}
        aria-label={text}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            color: '#FF2D6B',
            transform: 'translate(-4px, 0)',
            mixBlendMode: 'screen',
          }}
        >
          {text}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            color: '#4AF8FF',
            transform: 'translate(4px, 0)',
            mixBlendMode: 'screen',
          }}
        >
          {text}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            color: '#C6FF3D',
            transform: 'translate(0, 2px)',
            mixBlendMode: 'screen',
          }}
        >
          {text}
        </span>
        <span className="relative">{text}</span>
      </h1>
    </div>
  )
}

function TitleStyles() {
  return (
    <style>{`
      @keyframes scroll-hint-pulse {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0.15; }
      }
      @keyframes title-marquee {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-100%, 0, 0); }
      }
    `}</style>
  )
}
