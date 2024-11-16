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

export const baseFragmentShader = `
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

      out vec4 fragColor;
      
      void main() {
        vec4 texture = texture(uTexture, uv);
        // float dist = length(uv - vec2(0.5, 0.5)) * 2.0;
        // float mappedValue = mix(dist, normalizedValue, pow(dist + 0.1, 2.0));
        // float sdf = abs(fract(mappedValue * 5.0 / (dist + 1.0)) - 0.5) * 2.0;
        // float df = fwidth(sdf) * 3.0;
        // float lines = smoothstep(1.0-df, 1.0, sdf);
        // lines += smoothstep(df, 0.0, sdf);
        // fragColor = vec4(lines, lines, lines, lines);

        fragColor = vec4(texture.x, texture.y, texture.z, 1.0);
      }
    `;
