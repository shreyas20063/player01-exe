import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  count?: number
  radius?: number
}

/**
 * Drifting additive-blended THREE.Points cloud around the hero rock.
 */
export function ParticleField({ count = 1500, radius = 12 }: Props) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Spherical-ish shell, biased toward a horizontal disc for synthwave feel
      const r = radius * (0.35 + Math.random() * 0.65)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.45
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      sizes[i] = Math.random() * 0.04 + 0.01
    }
    return { positions, sizes }
  }, [count, radius])

  useFrame((state, delta) => {
    const obj = pointsRef.current
    if (!obj) return
    obj.rotation.y += delta * 0.02
    const mat = obj.material as THREE.PointsMaterial
    // Subtle breathing
    mat.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 0.6) * 0.15
  })

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return g
  }, [positions, sizes])

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        color={'#FF2D6B'}
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
