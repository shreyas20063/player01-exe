import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

type MapNode = {
  id: string
  label: string
}

const NODES: MapNode[] = [
  { id: 'title', label: 'TITLE' },
  { id: 'hero', label: 'HERO' },
  { id: 'character', label: 'CHARACTER' },
  { id: 'lore', label: 'LORE' },
  { id: 'world-map', label: 'WORLD_MAP' },
  { id: 'bosses', label: 'BOSSES' },
  { id: 'arsenal', label: 'ARSENAL' },
  { id: 'side-quests', label: 'SIDE_QUESTS' },
  { id: 'contact', label: 'CONTACT' },
  { id: 'credits', label: 'CREDITS' },
]

export function HUDMiniMap() {
  const [active, setActive] = useState<string>(NODES[0]?.id ?? 'title')

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const els: HTMLElement[] = []
    for (const node of NODES) {
      const el = document.getElementById(node.id)
      if (el) els.push(el)
    }
    if (els.length === 0) return undefined

    const visibility = new Map<string, number>()
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio)
        }
        let best = NODES[0]?.id ?? 'title'
        let bestRatio = -1
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        if (bestRatio > 0) setActive(best)
      },
      {
        rootMargin: '-30% 0px -30% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    for (const el of els) obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      className="pointer-events-none fixed right-3 top-1/2 z-[51] hidden -translate-y-1/2 flex-col items-end gap-2 font-mono text-[10px] uppercase tracking-[0.14em] md:flex"
      aria-label="Mini map navigation"
    >
      {NODES.map((node) => {
        const isActive = node.id === active
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => handleClick(node.id)}
            className="pointer-events-auto group flex items-center gap-2 border-none bg-transparent p-0 text-muted hover:text-text focus:outline-none"
            aria-label={`Jump to ${node.label}`}
            data-cursor={node.label}
          >
            <span
              className={cn(
                'pointer-events-none whitespace-nowrap text-[9px] opacity-0 transition-opacity duration-150 group-hover:opacity-100',
                isActive && 'text-magenta opacity-100'
              )}
            >
              {node.label}
            </span>
            <span className="relative inline-flex h-3 w-3 items-center justify-center">
              <motion.span
                className={cn(
                  'block h-1.5 w-1.5 border',
                  isActive
                    ? 'border-magenta bg-magenta'
                    : 'border-muted bg-transparent group-hover:border-cyan'
                )}
                animate={
                  isActive
                    ? { scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }
                    : { scale: 1, opacity: 1 }
                }
                transition={
                  isActive
                    ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.2 }
                }
                style={
                  isActive
                    ? { boxShadow: '0 0 8px #FF2D6B, 0 0 16px #FF2D6B88' }
                    : undefined
                }
              />
            </span>
          </button>
        )
      })}
    </nav>
  )
}
