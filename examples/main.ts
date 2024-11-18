import { Clock, remapValue, remapValues } from "../lib";
import { generatePolarSimplexNoiseValues } from "../lib/utils/noise.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  const count = 10;
  for (let i = 0; i < count; i++) {
    const offset = i / count;
    const remappedOffset = remapValue(offset, 0, 1, 0, 0.5);
    const noiseValues = generatePolarSimplexNoiseValues(100, 1);
    const data = remapValues(
      noiseValues,
      clock.height * (0.45 - remappedOffset),
      clock.height * (0.5 - remappedOffset)
    );

    clock.addRadialChart(data, {
      subdivisions: 3,
      tint: {
        r: offset * 255,
        g: (offset + 0.2) * 255,
        b: offset * 255,
        a: 255,
      },
    });
  }

  clock.addHandle({
    imageUrl: "./images/hours.png",
    scale: 0.2,
    offsetY: -0.23,
  });

  clock
    .addIndex({
      count: 48,
      offset: 30,
      shape: {
        type: "custom",
        handler: async (index, instance) => {
          return index % 2 === 1
            ? instance.createCircleElement({
                radius: 10,
                fill: "white",
              })
            : undefined;
        },
      },
    })
    .addIndex({
      count: 24,
      offset: 35,
      shape: {
        type: "custom",
        handler: async (index, instance) => {
          return instance.createTextElement({
            fontSize: 70,
            text: index.toString().padStart(2, "0"),
            fill: "white",
          });
        },
      },
    });
})();
