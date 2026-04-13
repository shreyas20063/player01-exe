import { Float } from '@react-three/drei'
import { ChromeBust } from './ChromeBust'
import { SynthwaveGrid } from './SynthwaveGrid'
import { Sun } from './Sun'
import { ParticleField } from './ParticleField'
import { PostFX } from './PostFX'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'

/**
 * Hero R3F scene. Mounted inside the global <Canvas> in App.tsx.
 * Bails out on reduced-motion / mobile — App.tsx handles fallback.
 */
export function HeroScene() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()

  if (reduced || mobile) return null

  return (
    <>
      {/* Lights — shader-heavy materials mostly ignore these, but Drei helpers use them */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 4]} intensity={0.8} color="#FF2D6B" />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#3AF1ED" />

      {/* Background layers */}
      <Sun />
      <SynthwaveGrid />
      <ParticleField count={1500} radius={14} />

      {/* Hero rock — pushed down so it sits below the headline text */}
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.55}>
        <ChromeBust position={[0.6, -1.4, 0]} scale={0.85} />
      </Float>

      {/* Post stack */}
      <PostFX />
    </>
  )
}
