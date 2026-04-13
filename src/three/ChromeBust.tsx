import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import rockVert from './shaders/rock.vert.glsl?raw'
import rockFrag from './shaders/rock.frag.glsl?raw'
import { useMousePosition } from '@/hooks/useMousePosition'

type Props = {
  position?: [number, number, number]
  scale?: number
}

/**
 * Displaced icosahedron "rock" with a custom ShaderMaterial.
 * Chrome + magenta fresnel + cyan pulsing veins + mouse reactivity.
 */
export function ChromeBust({ position = [0, 0, 0], scale = 1 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const mouse = useMousePosition()
  const target = useRef(new THREE.Vector2(0, 0))

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDisplace: { value: 0.35 },
    }),
    [],
  )

  useFrame((_, delta) => {
    const mat = matRef.current
    const mesh = meshRef.current
    if (!mat || !mesh) return

    // Advance time
    mat.uniforms.uTime.value += delta

    // Smoothly lerp mouse target
    target.current.set(mouse.normX, mouse.normY)
    const cur = mat.uniforms.uMouse.value as THREE.Vector2
    cur.lerp(target.current, Math.min(1, delta * 3.5))

    // Lazy rotation + mouse parallax
    mesh.rotation.y += delta * 0.15
    mesh.rotation.x = THREE.MathUtils.lerp(
      mesh.rotation.x,
      mouse.normY * 0.25,
      Math.min(1, delta * 2),
    )
    mesh.rotation.z = THREE.MathUtils.lerp(
      mesh.rotation.z,
      mouse.normX * -0.15,
      Math.min(1, delta * 2),
    )
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1.1, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={rockVert}
        fragmentShader={rockFrag}
        uniforms={uniforms}
      />
    </mesh>
  )
}
