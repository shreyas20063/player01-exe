import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  const vec3 MAGENTA = vec3(1.0, 0.176, 0.419);
  const vec3 CYAN    = vec3(0.227, 0.945, 0.929);

  float grid(vec2 p, float w) {
    vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    float line = min(g.x, g.y);
    return 1.0 - smoothstep(0.0, w, line);
  }

  void main() {
    // Scroll the grid toward the viewer in world space
    vec2 p = vWorldPos.xz;
    p.y += uTime * 2.2;

    float g1 = grid(p * 0.5, 1.2);
    float g2 = grid(p * 0.125, 1.6) * 0.55;
    float g = max(g1, g2);

    // Color ramp: cyan near horizon (far), magenta near camera
    float depth = clamp((-vWorldPos.z + 10.0) / 40.0, 0.0, 1.0);
    vec3 col = mix(MAGENTA, CYAN, depth);

    // Fog / horizon fade
    float fade = 1.0 - smoothstep(4.0, 28.0, length(vWorldPos.xz));
    float alpha = g * fade;

    // Horizon glow bloom seed
    col += CYAN * smoothstep(0.92, 1.0, depth) * 0.4;

    gl_FragColor = vec4(col * (0.6 + g * 0.9), alpha);
  }
`

export function SynthwaveGrid() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, -4]}>
      <planeGeometry args={[60, 60, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
