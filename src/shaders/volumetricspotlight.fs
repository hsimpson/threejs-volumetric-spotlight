precision highp float;

uniform vec3 color;
uniform float distance;
uniform float distanceStart;
uniform float distanceEnd;
uniform float blend;

varying vec3 posObjectSpace;

#define lerp mix

float saturate(float x) { return clamp(x, 0.0, 1.0); }

float invLerp(float a, float b, float t) { return (t - a) / (b - a); }

float invLerpClamped(float a, float b, float t) {
  return saturate(invLerp(a, b, t));
}

float computeAttenuation(float pixDistZ, float fallOffStart, float fallOffEnd,
                         float lerpLinearQuad) {
  // Attenuation
  float distFromSourceNormalized =
      invLerpClamped(fallOffStart, fallOffEnd, pixDistZ);

  // Almost simple linear attenuation between Fade Start and Fade End: Use
  // smoothstep for a better fall to zero rendering
  float attLinear = smoothstep(0.0, 1.0, 1.0 - distFromSourceNormalized);

  // Unity's custom quadratic attenuation
  // https://forum.unity.com/threads/light-attentuation-equation.16006/
  float attQuad =
      1.0 / (1.0 + 25.0 * distFromSourceNormalized * distFromSourceNormalized);

  const float kAttQuadStartToFallToZero = 0.8;
  attQuad *= saturate(smoothstep(
      1.0, kAttQuadStartToFallToZero,
      distFromSourceNormalized)); // Near the light's range (fade end) we fade
                                  // to 0 (because quadratic formula never falls
                                  // to 0)

  return lerp(attLinear, attQuad, lerpLinearQuad);
}

void main() {
  float intensity = 1.0;
  float pixDistFromSource = distance - ((posObjectSpace.y + distance * 0.5));

  // float pixDistFromSource = posObjectSpace.y;

  intensity *=
      computeAttenuation(pixDistFromSource, distanceStart, distanceEnd, blend);

  gl_FragColor = vec4(color, intensity);
  // gl_FragColor = vec4(color, 0.5);
}

// -6 ... +6
// 0 ..6.. 12
// 0 ... 1