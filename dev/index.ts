import { createClock, scaleTimeSeries } from "../lib";

createClock((clock, data) => {
  console.log(data);

  clock.addPlainCircle({
    radius: 50,
    tint: {
      r: 255,
      g: 0,
      b: 255,
      a: 200,
    },
  });
});
