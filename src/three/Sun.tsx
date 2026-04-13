import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;

  const vec3 HOT  = vec3(1.0, 0.88, 0.35);   // amber core
  const vec3 MID  = vec3(1.0, 0.33, 0.52);   // magenta
  const vec3 DARK = vec3(0.45, 0.05, 0.35);  // deep violet

  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;

    // Circular disk
    float disk = 1.0 - smoothstep(0.95, 1.02, d);
    if (disk < 0.001) discard;

    // Vertical gradient — sun gets hotter toward top
    float v = smoothstep(0.0, 1.0, vUv.y);
    vec3 col = mix(DARK, MID, v);
    col = mix(col, HOT, smoothstep(0.55, 1.0, v));

    // Classic retro horizontal bands — eat into the bottom half
    float bandY = (1.0 - vUv.y);
    float bands = smoothstep(0.0, 0.02, sin(bandY * 38.0 - uTime * 0.8) * 0.5 + 0.5 - bandY * 1.6);
    bands = clamp(bands, 0.0, 1.0);
    float bandMask = smoothstep(0.5, 0.02, vUv.y);
    float cut = mix(1.0, bands, bandMask);

    // Soft outer glow falloff
    float glow = smoothstep(1.02, 0.5, d);

    gl_FragColor = vec4(col * cut * glow, disk * cut);
  }
`

export function Sun() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta
  })

  return (
    <mesh position={[0, 0.1, -8]}>
      <planeGeometry args={[7.5, 7.5]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
