import {
  aggregateTimeSeries,
  Clock,
  getDay,
  linesFragmentShader,
  RadialChart,
  remapValues,
} from "../lib";
import { defaultClockStep as currentTimeAnimation } from "../lib/utils/animation.ts";
import { loadData } from "../lib/utils/csv.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  const hourlyData = await loadData("./data/clock_data_V1.csv");
  const supplyFromGrid = hourlyData["Electricity-supply-from-grid"];

  clock.addRadialChart(remapValues(supplyFromGrid.slice(0, 300), 200, 300), {
    subdivisions: 3,
    centerOffset: 50,
    tint: {
      r: 255,
      g: 0,
      b: 0,
      a: 255,
    },
  });

  clock.addRadialChart(remapValues(supplyFromGrid.slice(0, 300), 100, 200), {
    subdivisions: 3,
    centerOffset: 50,
    tint: {
      r: 255,
      g: 255,
      b: 0,
      a: 255,
    },
  });

  clock.addRectangles({
    count: 24,
    offset: 50,
    // radius: 20,
    width: 10,
    height: 20,
  });
})();
