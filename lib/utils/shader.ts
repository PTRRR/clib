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

  out vec4 fragColor;
`;

export const texturedFragmentShader = `
  ${defaultFragmentHeader}      
  void main() {
    vec4 texture = texture(uTexture, uv);
    fragColor = vec4(texture.x, texture.y, texture.z, 1.0) * uTint;
  }
`;

export const defaultFragmentShader = `
  ${defaultFragmentHeader}
  void main() {
    fragColor = vec4(1.0, 1.0, 1.0, 1.0) * uTint;
  }
`;

export const linesFragmentShader = `
  ${defaultFragmentHeader}
  void main() {
    float dist = length(uv - vec2(0.5, 0.5)) * 2.0;
    float mappedValue = normalizedValue;
    float sdf = abs(fract(mappedValue * 20.0) - 0.5) * 2.0;
    sdf = smoothstep(0.6, 0.50, sdf);
    fragColor = vec4(sdf, sdf, sdf, 1.0) * uTint;
  }
`;
