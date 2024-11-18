import { Clock, Index, remapValue, remapValues } from "../lib";
import { generatePolarSimplexNoiseValues } from "../lib/utils/noise.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  const count = 10;
  for (let i = 0; i < count; i++) {
    const offset = i / count;
    const remappedOffset = remapValue(offset, 0, 1, 0, 0.5);
    const noiseValues = generatePolarSimplexNoiseValues(100, 10);

    clock.addRadialChart(
      remapValues(
        noiseValues,
        clock.height * (0.45 - remappedOffset),
        clock.height * (0.5 - remappedOffset)
      ),
      {
        subdivisions: 2,
        tint: {
          r: offset * 255,
          g: (offset + 0.2) * 255,
          b: offset * 255,
          a: 255,
        },
      }
    );
  }

  clock.addHandle({
    imageUrl: "./images/hours.png",
    scale: 0.2,
    offsetY: -0.23,
  });

  new Index({
    count: 10,
    radius: 50,
    shape: {
      type: "text",
      params: {
        fontFamiy: "Arial",
        fontSize: 10,
      },
    },
  });
})();
