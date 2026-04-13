import { useEffect, useMemo, useRef, useState } from 'react'
import { prepareBody, flowAround } from '@/lib/pretext'
import type { PreparedBody, FlowLine, Obstacle } from '@/lib/pretext'
import { cn } from '@/lib/cn'

type PretextFlowProps = {
  text: string
  obstacle?: DOMRect | Obstacle | null
  fontSize?: number
  lineHeight?: number
  font?: string
  className?: string
}

function toObstacle(
  input: DOMRect | Obstacle | null | undefined,
  container: DOMRect | null
): Obstacle | null {
  if (!input) return null
  // DOMRect screen-space → container-relative
  if (container && typeof DOMRect !== 'undefined' && input instanceof DOMRect) {
    return {
      top: input.top - container.top,
      bottom: input.bottom - container.top,
      left: input.left - container.left,
      right: input.right - container.left,
    }
  }
  return {
    top: input.top,
    bottom: input.bottom,
    left: input.left,
    right: input.right,
  }
}

export function PretextFlow({
  text,
  obstacle = null,
  fontSize = 18,
  lineHeight = 28,
  font = '18px "Space Grotesk", system-ui, sans-serif',
  className,
}: PretextFlowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerRect(el.getBoundingClientRect())
    setWidth(el.clientWidth)
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      setWidth(entry.contentRect.width)
      setContainerRect(el.getBoundingClientRect())
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const prepared = useMemo<PreparedBody | null>(() => {
    if (typeof document === 'undefined') return null
    try {
      return prepareBody(text, font, fontSize, lineHeight)
    } catch {
      return null
    }
  }, [text, font, fontSize, lineHeight])

  const lines = useMemo<FlowLine[]>(() => {
    if (!prepared || width <= 0) return []
    try {
      const obs = toObstacle(obstacle ?? null, containerRect)
      return flowAround(prepared, width, obs)
    } catch {
      return []
    }
  }, [prepared, width, obstacle, containerRect])

  const totalHeight =
    lines.length > 0 ? (lines[lines.length - 1]?.y ?? 0) + lineHeight : lineHeight

  if (!prepared) {
    return (
      <p
        className={cn('whitespace-pre-wrap', className)}
        style={{ font, lineHeight: `${lineHeight}px` }}
      >
        {text}
      </p>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ minHeight: totalHeight, font }}
      aria-label={text}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            left: `${line.x}px`,
            top: `${line.y}px`,
            width: `${line.width}px`,
            lineHeight: `${lineHeight}px`,
            font,
            whiteSpace: 'pre',
          }}
        >
          {line.text}
        </span>
      ))}
    </div>
  )
}
