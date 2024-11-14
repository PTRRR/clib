import { Clock, remapValues } from "../lib";
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
