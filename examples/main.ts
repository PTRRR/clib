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
    .addCircles({ count: 10, radius: 10, offset: 30 })
    .addRectangles({ count: 10, width: 20, height: 5 })
    .addTriangles({ count: 10, width: 20, height: 80, offset: 60 })
    .addTexts({ count: 20, offset: 170, fontSize: 44 })
    .addCustomShape({
      count: 30,
      offset: 230,
      handler: (index, instance) =>
        instance.createTextElement({
          text: index.toString().padStart(2, "0"),
          fontSize: 40,
        }),
    });
})();
