export const baseVertexShader = `
  #version 300 es
  #define PI 3.1415926538

  precision mediump float;
  precision mediump int;

  in vec2 aPosition;
  in vec2 aUv;
  in float aValue;
  in float aNormalizedValue;
  
  out vec3 position;
  out float value;
  out float normalizedValue;
  out vec2 uv;

  uniform mat3 uProjectionMatrix;
  uniform mat3 uWorldTransformMatrix;
  uniform mat3 uTransformMatrix;

  void main() {
    position = vec3(aPosition, 0.0);
    uv = aUv;
    value = aValue;
    normalizedValue = aNormalizedValue;

    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
  }
`;

export const defaultFragmentHeader = `
  #version 300 es

  #define PI 3.1415926538
  #define MOD3 vec3(.1031,.11369,.13787)
  #define grad(x) length(vec2(dFdx(x),dFdy(x)))

  precision highp float;
  precision highp int;

  in vec3 position;
  in float value;
  in float normalizedValue;
  in vec2 uv;
  
  uniform sampler2D uTexture;
  uniform vec4 uTint;
  uniform float uRadialMaskStart;
  uniform float uRadialMaskEnd;

  out vec4 fragColor;

  vec2 rotateVec2(vec2 vec, float angle) {
    float mid = 0.5;
    return vec2(
      cos(angle) * (vec.x - mid) + sin(angle) * (vec.y - mid) + mid,
      cos(angle) * (vec.y - mid) - sin(angle) * (vec.x - mid) + mid
    );
  }

  float getRadialGradient(vec2 uv) {
    vec2 newUv = uv;
    newUv = newUv - vec2(0.5);
    
    float c = atan(newUv.y, newUv.x);
    c /= PI;
    c /= 2.0;
    c += 0.5;

    return c;
  }

  float getRadialMask(vec2 uv, float alpha, float smoothing) {
    vec2 newUv = rotateVec2(uv, PI * 0.5);
    newUv = newUv - vec2(0.5);
    
    float c = atan(newUv.y, newUv.x);
    c /= PI;
    c /= 2.0;
    c += 0.5;

    float dlx = fwidth(c) * smoothing;
    return smoothstep(c - dlx, c + dlx, alpha);
  }

  float getRadialMask(vec2 uv, float startAlpha, float endAlpha, float smoothing) {
    vec2 newUv = rotateVec2(uv, PI * 0.5);
    newUv = newUv - vec2(0.5);
    
    float c = atan(newUv.y, newUv.x);
    c /= PI;
    c /= 2.0;
    c += 0.5;

    float dlx = fwidth(c) * smoothing;
    return endAlpha >= 1.0 ? 1.0 : smoothstep(c + dlx, c - dlx, startAlpha) * smoothstep(c - dlx, c + dlx, endAlpha);
  }
`;
export const texturedFragmentShader = `
  ${defaultFragmentHeader}

  void main() {
    vec4 texture = texture(uTexture, uv);
    float radialMask = getRadialMask(uv, uRadialMaskStart, uRadialMaskEnd, .0001);
    fragColor = vec4(texture.x, texture.y, texture.z, 1.0) * uTint * radialMask;
  }
`;

export const defaultFragmentShader = `
  ${defaultFragmentHeader}

  void main() {
    float radialMask = getRadialMask(uv, uRadialMaskStart, uRadialMaskEnd, .0001);
    fragColor = vec4(1.0, 1.0, 1.0, 1.0) * uTint * radialMask;
  }
`;

export const linesFragmentShader = `
  ${defaultFragmentHeader}

  void main() {
    float radialMask = getRadialMask(uv, uRadialMaskStart, uRadialMaskEnd, .0001);
    float dist = length(uv - vec2(0.5, 0.5)) * 2.0;
    float mappedValue = normalizedValue;
    float sdf = abs(fract(mappedValue * 20.0) - 0.5) * 2.0;
    sdf = smoothstep(0.6, 0.50, sdf);
    fragColor = vec4(sdf, sdf, sdf, 1.0) * uTint * radialMask;
  }
`;
