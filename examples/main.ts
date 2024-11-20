import { Clock, RadialChart, remapValues } from "../lib";
import { defaultClockStep as currentTimeAnimation } from "../lib/utils/animation.ts";
import { generatePolarSimplexNoiseValues } from "../lib/utils/noise.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  const noiseValues = generatePolarSimplexNoiseValues(100, 1);

  clock.addRadialChart(
    remapValues(noiseValues, clock.height * 0.45, clock.height * 0.5),
    {
      subdivisions: 3,
      tint: {
        r: 255,
        g: 60,
        b: 120,
        a: 255,
      },
    }
  );

  clock.addRadialChart(
    remapValues(noiseValues, clock.height * 0.3, clock.height * 0.5),
    {
      subdivisions: 3,
      label: "chart",
      tint: {
        r: 245,
        g: 0,
        b: 30,
        a: 255,
      },
    }
  );

  clock
    .addCircles({ count: 0, radius: 10, offset: 10 })
    .addRectangles({ count: 12, height: 100, width: 2, offset: 100 });

  clock.addRadialChart(
    remapValues(noiseValues, clock.height * 0.1, clock.height * 0.5),
    {
      subdivisions: 3,
      tint: {
        r: 40,
        g: 0,
        b: 20,
        a: 255,
      },
    }
  );

  clock.addTexts({ count: 24, offset: 60, fontSize: 40 });

  clock.addHandle({
    label: "seconds",
    imageUrl: "./images/seconds.png",
    scale: 0.09,
    offsetY: -0.17,
  });

  const charts = clock.getLayersByLabel("chart") as RadialChart[];

  charts.forEach((chart) => {
    chart.setRadialMask(0.0, 0.25);
  });

  clock.addAnimation({
    duration: 5000,
    handler(progress, delta) {
      const step = currentTimeAnimation(clock);
      step.handler?.(progress, delta);

      const date = new Date();
      charts.forEach((chart) => {
        chart.setRadialMask(0.0, ((date.getTime() / 1000) % 60) / 60);
      });
    },
  });
})();
