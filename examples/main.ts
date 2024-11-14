import { Clock } from "../src/lib.js";
import { remapValues } from "../src/utils/value.ts";
import { data } from "./data.ts";

(async () => {
  const clock = new Clock();
  await clock.initialize();

  const dummyValues = remapValues(
    data,
    clock.height * 0.5 - 40,
    clock.height * 0.5
  );

  clock.addRadialChart(dummyValues);
})();
