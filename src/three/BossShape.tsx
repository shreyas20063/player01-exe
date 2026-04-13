import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMousePosition } from '@/hooks/useMousePosition'
import rockVert from './shaders/rock.vert.glsl?raw'
import rockFrag from './shaders/rock.frag.glsl?raw'

const ACCENT_VEC3: Record<string, [number, number, number]> = {
  magenta: [1.0, 0.176, 0.419],
  cyan: [0.29, 0.97, 1.0],
  amber: [1.0, 0.706, 0.31],
}

type Props = {
  accent: string
}

export function BossShape({ accent }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const mouse = useMousePosition()
  const target = useRef(new THREE.Vector2(0, 0))

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDisplace: { value: 0.45 },
      uAccent: { value: new THREE.Vector3(...(ACCENT_VEC3[accent] ?? ACCENT_VEC3.magenta!)) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Update accent color when panel changes
  useEffect(() => {
    const mat = matRef.current
    if (!mat) return
    const rgb = ACCENT_VEC3[accent] ?? ACCENT_VEC3.magenta!
    ;(mat.uniforms.uAccent.value as THREE.Vector3).set(...rgb)
  }, [accent])

  useFrame((_, delta) => {
    const mat = matRef.current
    const mesh = meshRef.current
    if (!mat || !mesh) return

    mat.uniforms.uTime.value += delta

    target.current.set(mouse.normX, mouse.normY)
    const cur = mat.uniforms.uMouse.value as THREE.Vector2
    cur.lerp(target.current, Math.min(1, delta * 4))

    mesh.rotation.y += delta * 0.25
    mesh.rotation.x = THREE.MathUtils.lerp(
      mesh.rotation.x,
      mouse.normY * 0.35,
      Math.min(1, delta * 2.5)
    )
    mesh.rotation.z = THREE.MathUtils.lerp(
      mesh.rotation.z,
      mouse.normX * -0.25,
      Math.min(1, delta * 2.5)
    )

    const breathe = Math.sin(mat.uniforms.uTime.value * 0.7) * 0.06 + 1.0
    mesh.scale.setScalar(breathe)
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={rockVert}
        fragmentShader={rockFrag}
        uniforms={uniforms}
      />
    </mesh>
  )
}
