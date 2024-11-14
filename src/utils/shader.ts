export const baseVertexShader = `
      #version 300 es
      #define PI 3.1415926538

      precision mediump float;
      precision mediump int;

      in vec2 aPosition;
      in float aValue;
      in float aDistance;
      
      out vec3 position;
      out float value;
      out float distance;

      uniform mat3 uProjectionMatrix;
      uniform mat3 uWorldTransformMatrix;
      uniform mat3 uTransformMatrix;


      void main() {
        position = vec3(aPosition, 0.0);
        value = aValue;
        distance = aDistance;

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
      in float distance;

      out vec4 fragColor;

      void main() {
        float line = abs(fract(distance * 5.0) - 0.5) * 2.0;
        fragColor = vec4(line, line, line, 1.0);
      }
    `;
