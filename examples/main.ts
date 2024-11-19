import { Clock, remapValues } from "../lib";
import { defaultClockStep as currentTimeAnimation } from "../lib/utils/animation.ts";
import { generatePolarSimplexNoiseValues } from "../lib/utils/noise.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  const noiseValues = generatePolarSimplexNoiseValues(100, 10);
  const data = remapValues(
    noiseValues,
    clock.height * 0.45,
    clock.height * 0.5
  );

  clock.addRadialChart(data, {
    subdivisions: 3,
    tint: {
      r: 255,
      g: 0,
      b: 120,
      a: 255,
    },
  });

  clock.addRadialChart(
    remapValues(noiseValues, clock.height * 0.3, clock.height * 0.5),
    {
      subdivisions: 3,
      tint: {
        r: 245,
        g: 0,
        b: 30,
        a: 255,
      },
    }
  );

  clock.addRadialChart(
    remapValues(noiseValues, clock.height * 0.1, clock.height * 0.5),
    {
      subdivisions: 3,
      tint: {
        r: 40,
        g: 0,
        b: 30,
        a: 255,
      },
    }
  );

  clock
    .addCircles({ count: 24, radius: 10, offset: 10 })
    .addTexts({ count: 12, offset: 60, fontSize: 40 })

    .addAnimation(currentTimeAnimation(clock));

  clock.addHandle({
    label: "hours",
    imageUrl: "./images/hours.png",
    scale: 0.09,
    offsetY: -0.25,
  });

  clock.addHandle({
    label: "seconds",
    imageUrl: "./images/seconds.png",
    scale: 0.09,
    offsetY: -0.17,
  });
})();
