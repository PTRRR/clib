import { createClock, scaleTimeSeries } from "../lib";

createClock((clock, data) => {
  console.log(data);

  const clockRadius = clock.width * 0.5;

  clock.addPlainCircle({
    radius: clockRadius,
    tint: {
      r: 0,
      g: 0,
      b: 255,
      a: 255,
    },
  });

  clock.addTexts({
    count: 20,
    fill: "black",
    fontSize: 40,
    offset: 40,
  });

  clock.addRectangles({
    count: 20,
    width: 3,
    height: 100,
    offset: 80,
    fill: "black",
  });
});
