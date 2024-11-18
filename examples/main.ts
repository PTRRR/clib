import { Clock, remapValues } from "../lib";
import { generatePolarSimplexNoiseValues } from "../lib/utils/noise.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  const noiseValues = generatePolarSimplexNoiseValues(100, 2);

  clock
    .addRadialChart(
      remapValues(noiseValues, clock.height * 0.48, clock.height * 0.5),
      {
        subdivisions: 2,
        samples: 200,
        tint: {
          r: 255,
          g: 0,
          b: 0,
          a: 255,
        },
      }
    )
    .addRadialChart(
      remapValues(noiseValues, clock.height * 0.4, clock.height * 0.5),
      {
        subdivisions: 3,
        tint: {
          r: 255,
          g: 255,
          b: 0,
          a: 255,
        },
      }
    )
    .addRadialChart(
      remapValues(noiseValues, clock.height * 0.35, clock.height * 0.4),
      {
        subdivisions: 2,
        tint: {
          r: 255,
          g: 0,
          b: 255,
          a: 255,
        },
      }
    );
})();
