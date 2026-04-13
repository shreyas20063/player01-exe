import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useGameStore } from '@/store/useGameStore'

type AudioApi = {
  play: (name: string) => void
  toggle: () => void
}

const AudioContextShim = createContext<AudioApi>({
  play: () => undefined,
  toggle: () => undefined,
})

type Props = { children: ReactNode }

export function AudioProvider({ children }: Props) {
  const audioOn = useGameStore((s) => s.audioOn)
  const toggleAudio = useGameStore((s) => s.toggleAudio)
  const ctxRef = useRef<AudioContext | null>(null)
  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current
    const AC: typeof AudioContext | undefined =
      typeof window !== 'undefined' ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined
    if (!AC) return null
    ctxRef.current = new AC()
    return ctxRef.current
  }, [])
  const play = useCallback(
    (name: string) => {
      if (!audioOn) return
      const ctx = ensureCtx()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      const now = ctx.currentTime
      switch (name) {
        case 'hover':
          osc.frequency.setValueAtTime(880, now)
          gain.gain.setValueAtTime(0.04, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
          osc.start(now)
          osc.stop(now + 0.1)
          break
        case 'click':
          osc.frequency.setValueAtTime(440, now)
          gain.gain.setValueAtTime(0.08, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
          osc.start(now)
          osc.stop(now + 0.15)
          break
        case 'unlock':
          osc.frequency.setValueAtTime(660, now)
          osc.frequency.linearRampToValueAtTime(990, now + 0.12)
          gain.gain.setValueAtTime(0.12, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)
          osc.start(now)
          osc.stop(now + 0.5)
          break
        default:
          osc.frequency.setValueAtTime(220, now)
          gain.gain.setValueAtTime(0.05, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
          osc.start(now)
          osc.stop(now + 0.25)
      }
    },
    [audioOn, ensureCtx]
  )
  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => undefined)
      ctxRef.current = null
    }
  }, [])
  const api = useMemo<AudioApi>(() => ({ play, toggle: toggleAudio }), [play, toggleAudio])
  return <AudioContextShim.Provider value={api}>{children}</AudioContextShim.Provider>
}

export function useAudio(): AudioApi {
  return useContext(AudioContextShim)
}
