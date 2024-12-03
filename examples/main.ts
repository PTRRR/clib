import { createClock, defaultClockStep as currentTimeAnimation } from "../lib";

createClock((clock) => {
  clock.addHandle({
    imageUrl: "./images/seconds.png",
    scale: 0.1,
    offsetY: -0.166,
    label: "seconds",
  });

  clock.addHandle({
    imageUrl: "./images/minutes.png",
    scale: 0.1,
    offsetY: -0.166,
    label: "minutes",
  });

  clock.addHandle({
    imageUrl: "./images/hours.png",
    scale: 0.1,
    offsetY: -0.23,
    label: "hours",
  });

  clock.addAnimation({
    duration: 3000,
    handler: (progress, delta) => {
      const step = currentTimeAnimation(clock);
      step.handler?.(progress, delta);
    },
  });
});
