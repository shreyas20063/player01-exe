import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { projects } from '@/data/projects'
import { cn } from '@/lib/cn'

type BossNode = {
  id: string
  title: string
  tagline: string
  number: string
  accent: 'magenta' | 'cyan' | 'amber'
  x: number
  y: number
}

const VIEWBOX_W = 1200
const VIEWBOX_H = 640

const NODE_POSITIONS: Array<{ x: number; y: number }> = [
  { x: 220, y: 440 },
  { x: 600, y: 200 },
  { x: 960, y: 420 },
]

const ACCENT_HEX: Record<'magenta' | 'cyan' | 'amber', string> = {
  magenta: '#FF2D6B',
  cyan: '#4AF8FF',
  amber: '#FFB14E',
}

function scrollToBosses() {
  document.getElementById('bosses')?.scrollIntoView({ behavior: 'smooth' })
}

export function WorldMap() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const nodes: BossNode[] = projects.slice(0, 3).map((p, i) => {
    const pos = NODE_POSITIONS[i] ?? NODE_POSITIONS[0]!
    return {
      id: p.id,
      title: p.title,
      tagline: p.tagline,
      number: p.number,
      accent: (p.accent as 'magenta' | 'cyan' | 'amber') ?? 'magenta',
      x: pos.x,
      y: pos.y,
    }
  })

  const pathPoints: string[] = []
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i]!
    const b = nodes[i + 1]!
    const midX = (a.x + b.x) / 2
    const midY = Math.min(a.y, b.y) - 60
    pathPoints.push(`M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`)
  }

  return (
    <section
      ref={sectionRef}
      id="world-map"
      className="relative min-h-[90vh] w-full overflow-hidden bg-void px-6 py-24 sm:px-10 lg:px-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-lines opacity-15" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(74,248,255,0.08), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
            <span className="inline-block h-px w-10 bg-amber" />
            <span>STAGE SELECT</span>
          </div>
          <h2
            className="font-display text-5xl sm:text-6xl lg:text-[6rem] leading-none text-text"
            style={{ textShadow: '2px 0 var(--color-cyan), -2px 0 var(--color-magenta)' }}
          >
            WORLD_MAP
          </h2>
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            <span className="text-cyan">{'//'}</span> 3 BOSSES DETECTED — CLICK TO ENGAGE
          </div>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            className="block h-auto w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="wm-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="wm-glow-strong" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="wm-iso" width="48" height="28" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 14 L 24 0 L 48 14 L 24 28 Z"
                  fill="none"
                  stroke="#1F1A38"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>

            {/* Iso grid backdrop */}
            <rect width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#wm-iso)" />

            {/* Diagonal scan lines */}
            <g opacity="0.08">
              {Array.from({ length: 20 }).map((_, i) => (
                <line
                  key={i}
                  x1={i * 80 - 200}
                  y1={0}
                  x2={i * 80 + 200}
                  y2={VIEWBOX_H}
                  stroke="#4AF8FF"
                  strokeWidth="0.5"
                />
              ))}
            </g>

            {/* Connecting dotted paths */}
            {pathPoints.map((d, i) => {
              const active = hoveredId !== null
              return (
                <g key={i}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="#4AF8FF"
                    strokeOpacity={0.35}
                    strokeWidth={1.2}
                    strokeDasharray="6 6"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : undefined}
                    transition={{ duration: 1.6, delay: 0.3 + i * 0.2, ease: 'easeInOut' }}
                  />
                  {active && (
                    <motion.path
                      d={d}
                      fill="none"
                      stroke="#FF2D6B"
                      strokeWidth={1.6}
                      strokeDasharray="8 6"
                      filter="url(#wm-glow)"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -140 }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {nodes.map((node, i) => {
              const isHovered = hoveredId === node.id
              const accent = ACCENT_HEX[node.accent]
              return (
                <BossNodeGroup
                  key={node.id}
                  node={node}
                  index={i}
                  inView={inView}
                  isHovered={isHovered}
                  accent={accent}
                  onHoverStart={() => setHoveredId(node.id)}
                  onHoverEnd={() => setHoveredId((id) => (id === node.id ? null : id))}
                  onClick={scrollToBosses}
                />
              )
            })}
          </svg>

          {/* Tooltip overlay — HTML, positioned over SVG */}
          <AnimatePresence>
            {hoveredId && (() => {
              const node = nodes.find((n) => n.id === hoveredId)
              if (!node) return null
              const leftPct = (node.x / VIEWBOX_W) * 100
              const topPct = (node.y / VIEWBOX_H) * 100
              return (
                <motion.div
                  key={hoveredId}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="pointer-events-none absolute -translate-x-1/2"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: `translate(-50%, calc(-100% - 48px))`,
                  }}
                >
                  <div
                    className="border bg-surface/95 px-4 py-3 font-mono text-xs backdrop-blur-sm"
                    style={{
                      borderColor: ACCENT_HEX[node.accent],
                      boxShadow: `0 0 24px ${ACCENT_HEX[node.accent]}55`,
                    }}
                  >
                    <div
                      className="mb-1 text-[9px] uppercase tracking-[0.22em]"
                      style={{ color: ACCENT_HEX[node.accent] }}
                    >
                      {node.number}
                    </div>
                    <div className="font-display text-lg leading-none text-text">
                      {node.title}
                    </div>
                    <div className="mt-1 max-w-[220px] text-[10px] uppercase tracking-wide text-muted">
                      {node.tagline}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[9px] uppercase tracking-widest text-cyan">
                      <span>&gt;</span>
                      <span>CLICK TO ENGAGE</span>
                    </div>
                  </div>
                </motion.div>
              )
            })()}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-grid-line)] pt-6 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span>MAP: PLAYER_01_REGION</span>
          <span className="text-cyan">DIFFICULTY: VARIES</span>
          <span className="text-amber">CONTINUE?</span>
        </div>
      </div>
    </section>
  )
}

type BossNodeGroupProps = {
  node: BossNode
  index: number
  inView: boolean
  isHovered: boolean
  accent: string
  onHoverStart: () => void
  onHoverEnd: () => void
  onClick: () => void
}

function BossNodeGroup({
  node,
  index,
  inView,
  isHovered,
  accent,
  onHoverStart,
  onHoverEnd,
  onClick,
}: BossNodeGroupProps) {
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 })

  const handlePointerMove = (e: ReactPointerEvent<SVGGElement>) => {
    const target = e.currentTarget
    const svg = target.ownerSVGElement
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const local = pt.matrixTransform(ctm.inverse())
    const dx = local.x - node.x
    const dy = local.y - node.y
    const dist = Math.hypot(dx, dy)
    if (dist < 110) {
      const pull = 1 - dist / 110
      setMagnetOffset({ x: dx * 0.28 * pull, y: dy * 0.28 * pull })
    } else {
      setMagnetOffset({ x: 0, y: 0 })
    }
  }

  return (
    <motion.g
      style={{
        cursor: 'pointer',
        transformOrigin: `${node.x}px ${node.y}px`,
        transformBox: 'view-box',
      }}
      onPointerEnter={onHoverStart}
      onPointerLeave={() => {
        onHoverEnd()
        setMagnetOffset({ x: 0, y: 0 })
      }}
      onPointerMove={handlePointerMove}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={
        inView
          ? {
              opacity: 1,
              scale: isHovered ? 1.15 : 1,
              x: magnetOffset.x,
              y: magnetOffset.y,
            }
          : undefined
      }
      transition={{
        opacity: { duration: 0.6, delay: 0.6 + index * 0.15 },
        scale: { type: 'spring', stiffness: 220, damping: 18 },
        x: { type: 'spring', stiffness: 220, damping: 18 },
        y: { type: 'spring', stiffness: 220, damping: 18 },
      }}
    >
      {/* invisible hit area */}
      <circle cx={node.x} cy={node.y} r={70} fill="transparent" />
      {/* outer rings */}
      <circle
        cx={node.x}
        cy={node.y}
        r={42}
        fill="none"
        stroke={accent}
        strokeOpacity={isHovered ? 0.5 : 0.2}
        strokeWidth={1}
        strokeDasharray="2 4"
      />
      <circle
        cx={node.x}
        cy={node.y}
        r={30}
        fill="none"
        stroke={accent}
        strokeOpacity={0.5}
        strokeWidth={1.2}
        filter="url(#wm-glow)"
      />
      {/* isometric diamond boss marker */}
      <g filter="url(#wm-glow-strong)">
        <polygon
          points={`${node.x},${node.y - 18} ${node.x + 16},${node.y} ${node.x},${node.y + 18} ${node.x - 16},${node.y}`}
          fill={isHovered ? accent : '#15102A'}
          stroke={accent}
          strokeWidth={2}
        />
        <polygon
          points={`${node.x},${node.y - 10} ${node.x + 8},${node.y} ${node.x},${node.y + 10} ${node.x - 8},${node.y}`}
          fill={accent}
        />
      </g>
      {/* label */}
      <text
        x={node.x}
        y={node.y + 64}
        textAnchor="middle"
        className={cn('font-mono')}
        style={{
          fill: isHovered ? accent : '#F5F0FF',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {node.number}
      </text>
    </motion.g>
  )
}
