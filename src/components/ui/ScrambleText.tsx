import { useEffect } from 'react'
import { useTextScramble } from '@/hooks/useTextScramble'
import { cn } from '@/lib/cn'

type ScrambleTextStatic = {
  text: string
  cycle?: undefined
  interval?: undefined
  className?: string
}

type ScrambleTextCycle = {
  text?: undefined
  cycle: string[]
  interval?: number
  className?: string
}

type ScrambleTextProps = ScrambleTextStatic | ScrambleTextCycle

export function ScrambleText(props: ScrambleTextProps) {
  const { ref, scrambleTo } = useTextScramble<HTMLSpanElement>()
  const { className } = props
  const staticText = 'text' in props ? props.text : undefined
  const cycle = 'cycle' in props ? props.cycle : undefined
  const interval = 'interval' in props ? props.interval : undefined

  useEffect(() => {
    if (staticText !== undefined) {
      void scrambleTo(staticText)
      return
    }
    if (!cycle || cycle.length === 0) return
    let idx = 0
    let cancelled = false
    const tick = async () => {
      if (cancelled) return
      const next = cycle[idx % cycle.length] ?? ''
      await scrambleTo(next)
      idx += 1
    }
    void tick()
    const id = window.setInterval(() => {
      void tick()
    }, interval ?? 2600)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [staticText, cycle, interval, scrambleTo])

  return <span ref={ref} className={cn('inline-block', className)} />
}
