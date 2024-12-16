import { addValues, createClock, extractPeriod, scaleValues } from "../lib";

createClock(
  (clock, data) => {
    clock.addPlainCircle({
      radius: 250,
      fill: "#ff9500",
      outline: true,
      thickness: 40,
      radialMask: {
        start: 0,
        end: 0.25,
      },
    });

    clock.addPlainCircle({
      radius: 200,
      fill: "#ff3b30",
      outline: true,
      thickness: 40,
      radialMask: {
        start: 0.25,
        end: 0.5,
      },
    });

    clock.addPlainCircle({
      radius: 150,
      fill: "#5856d6",
      outline: true,
      thickness: 40,
      radialMask: {
        start: 0.5,
        end: 0.75,
      },
    });

    clock.addPlainCircle({
      radius: 100,
      fill: "#ffcc00",
      outline: true,
      thickness: 40,
      radialMask: {
        start: 0.75,
        end: 1,
      },
    });

    clock.addTexts({
      count: 24,
      fontSize: 40,
      offset: 40,
    });

    clock.addHandle({
      imageUrl:
        "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/images/seconds.png",
      scale: 0.1,
      offsetY: -0.166,
      label: "seconds",
    });
  },
  {
    dataUrl:
      "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/single_building.csv",
  }
);
