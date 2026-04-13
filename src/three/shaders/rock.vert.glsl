// Rock vertex shader — noise-displaced icosahedron
// Passes world-ish normal, position, and view vector to fragment.

uniform float uTime;
uniform vec2  uMouse;
uniform float uDisplace;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;

// Cheap hash-based 3D noise. Not simplex — but lively enough for a hero rock.
vec3 hash3(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7,  74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  );
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
          dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
      mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
          dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
    mix(
      mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
          dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
      mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
          dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y),
    u.z);
}

// Multi-octave fractal noise
float fbm(vec3 p) {
  float n = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    n += a * noise3(p);
    p *= 2.03;
    a *= 0.5;
  }
  return n;
}

void main() {
  vec3 pos = position;

  // Breathing, swirling domain for the noise
  float t = uTime * 0.4;
  vec3 np = pos * 2.0 + vec3(t, -t * 0.8, t * 0.6);

  // Mouse warps the noise field
  np.xy += uMouse * 0.9;

  float n = fbm(np);
  float wave = sin(pos.y * 4.0 + uTime * 1.5) * 0.5;
  float spike = pow(abs(n), 0.6) * sign(n);  // sharper peaks
  float disp = (spike * 0.6 + wave * 0.2) * uDisplace;

  vec3 displaced = pos + normal * disp;

  vPosition = displaced;
  vNormal = normalize(normalMatrix * normal);
  vNoise = n;

  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vViewDir = normalize(-mv.xyz);

  gl_Position = projectionMatrix * mv;
}
