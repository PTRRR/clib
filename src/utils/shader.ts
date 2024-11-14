export const baseVertexShader = `
      #version 300 es
      #define PI 3.1415926538

      precision mediump float;
      precision mediump int;

      in vec2 position;
      
      out vec3 vPosition;

      uniform mat3 uProjectionMatrix;
      uniform mat3 uWorldTransformMatrix;
      uniform mat3 uTransformMatrix;


      void main() {
        vPosition = vec3(position, 0.0);

        mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
        gl_Position = vec4((mvp * vec3(position, 1.0)).xy, 0.0, 1.0);
      }
    `;

export const baseFragmentShader = `
      #version 300 es

      #define PI 3.1415926538
      #define MOD3 vec3(.1031,.11369,.13787)
      #define grad(x) length(vec2(dFdx(x),dFdy(x)))

      precision highp float;
      precision highp int;

      out vec4 fragColor;

      void main() {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;
