export const vertexShader = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aFromB;
attribute float aToB;
attribute vec4 aRand;

uniform float uMix;
uniform float uTime;
uniform float uDpr;
uniform float uReduced;
uniform float uScatter;
uniform vec3 uFromX; // slot centre (px) and scale
uniform vec3 uToX;
uniform vec2 uRot;
uniform vec3 uPointer; // position (px) and push strength
uniform vec2 uAlpha;
uniform vec2 uSize;
uniform vec2 uAccent;
uniform vec2 uCycle;
uniform float uVelocity; // smoothed scroll speed, px per frame
uniform vec2 uType; // typed text: visible up to x, and the cursor's shift

varying float vAlpha;
varying float vAccent;
varying float vCycle;
varying vec3 vCycleColor;

// Lime, aqua, violet, coral, and back to lime.
vec3 palette(float t) {
  t = fract(t) * 4.0;
  vec3 lime = vec3(0.714, 1.0, 0.235);
  vec3 aqua = vec3(0.3, 0.92, 1.0);
  vec3 violet = vec3(0.68, 0.58, 1.0);
  vec3 coral = vec3(1.0, 0.56, 0.4);
  if (t < 1.0) return mix(lime, aqua, smoothstep(0.0, 1.0, t));
  if (t < 2.0) return mix(aqua, violet, smoothstep(0.0, 1.0, t - 1.0));
  if (t < 3.0) return mix(violet, coral, smoothstep(0.0, 1.0, t - 2.0));
  return mix(coral, lime, smoothstep(0.0, 1.0, t - 3.0));
}

vec3 rotate(vec3 p) {
  float cy = cos(uRot.x), sy = sin(uRot.x);
  float cx = cos(uRot.y), sx = sin(uRot.y);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  return vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
}

void main() {
  vec3 a = rotate(aFrom) * uFromX.z + vec3(uFromX.xy, 0.0);
  // Typed text: the cursor walks along the line and letters appear behind it.
  float isCursor = step(1.5, aToB);
  vec3 target = aTo + vec3(uType.y * isCursor, 0.0, 0.0);
  float typed = max(isCursor, step(aTo.x, uType.x));
  vec3 b = rotate(target) * uToX.z + vec3(uToX.xy, 0.0);

  // Each particle leaves at a slightly different moment.
  float m = clamp((uMix - aRand.x * 0.3) / 0.7, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);

  vec3 p;
  float fade = 1.0;
  if (uReduced > 0.5) {
    // No travel: cross-fade between the two shapes instead.
    m = step(0.5, uMix);
    p = mix(a, b, m);
    fade = clamp(abs(uMix - 0.5) * 5.0, 0.0, 1.0);
  } else {
    p = mix(a, b, m);
    p.xy += (aRand.yz - 0.5) * sin(m * 3.14159265) * uScatter;
    // A slow swell travels through the whole shape; each particle also wanders a little.
    p.xy += vec2(sin(p.y * 0.011 + uTime * 0.55), cos(p.x * 0.009 + uTime * 0.42)) * 3.2;
    p.xy += vec2(sin(uTime * 0.7 + aRand.w * 6.283), cos(uTime * 0.55 + aRand.y * 6.283)) * 1.6;
    // Fast scrolling leaves the lighter particles behind; they catch up when it stops.
    float lag = 0.1 + aRand.z * aRand.z;
    p.y -= uVelocity * lag * 2.4;
    p.x += uVelocity * (aRand.y - 0.5) * lag * 0.7;
    vec2 away = p.xy - uPointer.xy;
    float push = smoothstep(130.0, 0.0, length(away));
    p.xy += normalize(away + vec2(0.0001)) * push * uPointer.z * (0.4 + aRand.x);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = mix(uSize.x, uSize.y, m) * (0.7 + aRand.w * 0.6) * uDpr;

  // Brightness above 2 marks particles that blink (the terminal cursor).
  float still = step(0.5, uReduced);
  float blink = mix(0.1 + 0.9 * smoothstep(-0.25, 0.25, sin(uTime * 4.2)), 1.0, still);
  float fromB = aFromB > 1.5 ? (aFromB - 2.0) * blink : aFromB;
  float toB = (aToB > 1.5 ? (aToB - 2.0) * blink : aToB) * typed;
  float twinkle = mix(0.82 + 0.18 * sin(uTime * 1.1 + aRand.w * 40.0), 1.0, still);
  vAlpha = mix(uAlpha.x, uAlpha.y, m) * mix(fromB, toB, m) * fade * twinkle;
  vAccent = mix(uAccent.x, uAccent.y, m);
  // The colours travel across the shape, so neighbouring letters differ slightly.
  vCycle = mix(uCycle.x, uCycle.y, m) * (1.0 - still);
  vCycleColor = palette(uTime * 0.07 - p.x * 0.0007);
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccentColor;

varying float vAlpha;
varying float vAccent;
varying float vCycle;
varying vec3 vCycleColor;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  vec3 color = mix(mix(uColor, uAccentColor, vAccent), vCycleColor, vCycle);
  gl_FragColor = vec4(color, smoothstep(0.5, 0.25, d) * vAlpha);
}
`;

/** Far layer: sparse dim specks that drift and move slower than the page (parallax). */
export const backdropVertexShader = /* glsl */ `
attribute vec4 aSeed; // x, y, depth, random; all 0..1

uniform vec2 uRes;
uniform float uScroll;
uniform float uTime;
uniform float uDpr;

varying float vAlpha;

void main() {
  float depth = aSeed.z;
  vec2 span = uRes * 1.2;
  float x = mod(aSeed.x * span.x + uTime * (2.0 + 7.0 * depth) * (aSeed.w - 0.35), span.x) - span.x * 0.5;
  float y = mod(aSeed.y * span.y + uScroll * (0.05 + 0.3 * depth) + uTime * (1.5 + 4.5 * depth), span.y) - span.y * 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, 0.0, 1.0);
  gl_PointSize = (1.0 + 2.2 * depth * depth) * uDpr;
  vAlpha = (0.1 + 0.34 * depth) * (0.6 + 0.4 * sin(uTime * (0.4 + aSeed.w) + aSeed.w * 40.0));
}
`;

export const backdropFragmentShader = /* glsl */ `
uniform vec3 uColor;

varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.2, d) * vAlpha);
}
`;

/** Full-screen haze: slow domain-warped noise, tinted with the accent when a scene asks for it. */
export const hazeVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const hazeFragmentShader = /* glsl */ `
uniform vec2 uRes;
uniform float uScroll;
uniform float uTime;
uniform float uTint;
uniform vec3 uColor;
uniform vec3 uAccentColor;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.0);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime * 0.03;
  vec2 q = p * 1.3 + vec2(t, t * 0.6 - uScroll * 0.00025);
  float field = fbm(q + fbm(q * 1.7 - t) * 0.9);
  float haze = smoothstep(0.38, 0.8, field);
  float core = exp(-dot(p, p) * 3.0) * uTint;

  vec3 color = mix(uColor, uAccentColor, clamp(core * 1.5 + uTint * 0.4, 0.0, 1.0));
  float alpha = haze * 0.075 + core * 0.06;
  // Grain hides banding in the dark gradient.
  alpha += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.012;
  gl_FragColor = vec4(color, max(alpha, 0.0));
}
`;
