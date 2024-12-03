import { createClock } from "../lib";

createClock((clock) => {
  clock.addCircles({
    count: 24,
    radius: 20,
    offset: 20,
  });
});
