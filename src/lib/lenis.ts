import Lenis from 'lenis'

export function createLenis(): Lenis {
  return new Lenis({
    lerp: 0.085,
    duration: 1.1,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  })
}

export type { Lenis }
