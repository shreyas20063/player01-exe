import { Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'

type Props = {
  children: ReactNode
}

export function Scene({ children }: Props) {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  if (reduced) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    >
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        frameloop="always"
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
