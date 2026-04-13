import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { Vector2 } from 'three'

/**
 * Post-processing stack for the hero scene.
 * Bloom carries the synthwave glow; CA + noise + vignette seal the vibe.
 */
export function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <ChromaticAberration offset={new Vector2(0.0015, 0.001)} />
      <Noise opacity={0.08} premultiply />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  )
}
