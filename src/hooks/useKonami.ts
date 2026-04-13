import { useEffect } from 'react'

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export function useKonami(onUnlock: () => void): void {
  useEffect(() => {
    let progress = 0
    const handler = (e: KeyboardEvent) => {
      const expected = SEQUENCE[progress]
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === expected) {
        progress++
        if (progress === SEQUENCE.length) {
          progress = 0
          onUnlock()
        }
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onUnlock])
}
