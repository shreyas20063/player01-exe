import { useCallback, useEffect, useRef } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

type QueueItem = {
  from: string
  to: string
  start: number
  end: number
  char: string
}

export function useTextScramble<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const frameRef = useRef(0)
  const frame = useRef(0)
  const queue = useRef<QueueItem[]>([])
  const resolver = useRef<(() => void) | null>(null)

  const render = useCallback(() => {
    const el = ref.current
    if (!el) return
    while (el.firstChild) el.removeChild(el.firstChild)
    let complete = 0
    const q = queue.current
    const currentFrame = frame.current
    for (let i = 0; i < q.length; i++) {
      const item = q[i]
      if (!item) continue
      if (currentFrame >= item.end) {
        complete++
        el.appendChild(document.createTextNode(item.to))
      } else if (currentFrame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = CHARS[Math.floor(Math.random() * CHARS.length)] ?? '?'
        }
        const span = document.createElement('span')
        span.style.opacity = '0.72'
        span.style.color = 'var(--color-cyan)'
        span.appendChild(document.createTextNode(item.char))
        el.appendChild(span)
      } else {
        el.appendChild(document.createTextNode(item.from))
      }
    }
    if (complete === q.length) {
      resolver.current?.()
      resolver.current = null
      cancelAnimationFrame(frameRef.current)
    } else {
      frame.current = currentFrame + 1
      frameRef.current = requestAnimationFrame(render)
    }
  }, [])

  const scrambleTo = useCallback(
    (next: string): Promise<void> => {
      const el = ref.current
      if (!el) return Promise.resolve()
      const current = el.innerText
      const length = Math.max(current.length, next.length)
      const q: QueueItem[] = []
      for (let i = 0; i < length; i++) {
        const from = current[i] ?? ''
        const to = next[i] ?? ''
        const start = Math.floor(Math.random() * 20)
        const end = start + Math.floor(Math.random() * 20) + 10
        q.push({ from, to, start, end, char: '' })
      }
      queue.current = q
      cancelAnimationFrame(frameRef.current)
      frame.current = 0
      return new Promise<void>((resolve) => {
        resolver.current = resolve
        render()
      })
    },
    [render]
  )

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return { ref, scrambleTo }
}
