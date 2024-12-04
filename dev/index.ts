import { createClock, defaultFragmentHeader } from "../lib";

createClock((clock) => {
  const radius = clock.width * 0.5;

  const customFragmentShader = `
    ${defaultFragmentHeader}

    void main() {
      vec2 newUv = rotateVec2(uv, PI * 0.5);
      float gradient = getRadialGradient(newUv);
      fragColor = vec4(gradient, gradient, gradient, 1.0);
    }
`;

  clock.addRadialChart(new Array(100).fill(radius * 0.8), {
    subdivisions: 5,
    fragmentShader: customFragmentShader,
  });

  clock.addRectangles({
    count: 12,
    width: 3,
    height: 30,
    offset: 20,
  });

  clock.addCustomShape({
    count: 12,
    handler: async (index, instance) => {
      return instance.createTextElement({
        text: `${index.toString().padStart(2, "0")}`,
        fontSize: 20,
        offset: 10,
      });
    },
  });
});
