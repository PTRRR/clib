import { Clock, RadialChart } from "../src/lib.js";

(async () => {
  const clock = new Clock();
  await clock.initialize();

  const layer = new RadialChart({
    data: [],
    radius: clock.height * 0.5,
  });

  layer.position.set(clock.center.x, clock.center.y);

  clock.addLayer(layer);
})();
