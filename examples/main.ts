import { Clock, remapValues } from "../lib";
import { data } from "./data.ts";

(async () => {
  const clock = new Clock();
  await clock.initialize();

  const dummyValues = remapValues(data, 200, 300);

  clock.addRadialChart(dummyValues, {
    subdivisions: 4,
    // samples: 400,
  });
})();
