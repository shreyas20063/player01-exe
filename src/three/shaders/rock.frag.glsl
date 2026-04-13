// Boss shape fragment — accent-colored morphing orb.
// uAccent drives the entire color scheme per boss panel.

precision highp float;

uniform float uTime;
uniform vec2  uMouse;
uniform vec3  uAccent;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;

const vec3 VOID = vec3(0.027, 0.020, 0.047);

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);

  // --- Dark glass base tinted by accent
  float vertical = N.y * 0.5 + 0.5;
  vec3 base = mix(VOID, uAccent * 0.15, pow(vertical, 1.8));

  // --- Strong fresnel rim in accent color
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.5);

  // --- Inner glow: accent color bleeds from inside based on noise
  float inner = smoothstep(0.0, 0.6, abs(vNoise));
  vec3 innerGlow = uAccent * inner * 0.35;

  // --- Pulsing energy veins — accent-tinted
  float vein = sin(vPosition.x * 8.0 + vPosition.y * 5.0 + uTime * 2.5);
  vein = smoothstep(0.82, 1.0, vein * 0.5 + 0.5);
  vein *= smoothstep(0.05, 0.45, abs(vNoise));

  // --- Surface cracks — bright accent lines in noise seams
  float cracks = smoothstep(0.38, 0.44, abs(vNoise));

  // --- Mouse reactive hotspot
  float mDist = length(vPosition.xy - vec2(uMouse.x, uMouse.y) * 1.4);
  float hotspot = exp(-mDist * 2.8) * 0.4;

  // --- Combine
  vec3 color = base;
  color += uAccent * fres * 1.2;          // bright accent rim
  color += innerGlow;                      // inner accent bleed
  color += uAccent * vein * 0.8;          // accent veins
  color += uAccent * cracks * 0.5;        // accent cracks
  color += uAccent * hotspot;             // cursor glow

  // Subtle complementary tint on underside
  vec3 complement = vec3(1.0) - uAccent;
  color += complement * max(-N.y, 0.0) * 0.08;

  // Tone curve — keep it punchy, not washed
  color = color / (color + vec3(0.6));     // simple Reinhard tonemap
  color = pow(color, vec3(0.88));          // slight gamma lift

  gl_FragColor = vec4(color, 1.0);
}
