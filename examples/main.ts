import { Clock, remapValues } from "../lib";
import { data } from "./data.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  clock.addRadialChart(
    remapValues(data, clock.height * 0.4, clock.height * 0.5),
    { subdivisions: 4, texture: "https://pixijs.com/assets/panda.png" }
  );
})();
