import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useKonami } from '@/hooks/useKonami'
import { useGameStore } from '@/store/useGameStore'

export function KonamiUnlock() {
  const konami = useGameStore((s) => s.konami)
  const [flash, setFlash] = useState(false)

  const handleUnlock = useCallback(() => {
    const store = useGameStore.getState()
    store.setKonami(true)
    store.unlock('konami')
    setFlash(true)
    window.setTimeout(() => setFlash(false), 400)
  }, [])

  useKonami(handleUnlock)

  useEffect(() => {
    if (konami) {
      document.documentElement.dataset.konami = 'true'
    } else {
      delete document.documentElement.dataset.konami
    }
  }, [konami])

  return (
    <>
      <AnimatePresence>
        {flash ? (
          <motion.div
            key="konami-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 bg-lime"
            style={{ zIndex: 95, mixBlendMode: 'screen' }}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>

      {konami ? (
        <div
          className="pointer-events-none fixed right-3 top-3 border border-lime px-2 py-1 font-mono text-lime"
          style={{ fontSize: '10px', zIndex: 94, letterSpacing: '0.1em' }}
          aria-hidden="true"
        >
          ▲▲▼▼◄►◄► DEBUG MODE
        </div>
      ) : null}
    </>
  )
}
