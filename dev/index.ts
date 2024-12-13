import { createClock, scaleTimeSeries } from "../lib";

// Data URLs:

// Single building:
// https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/single_building.csv

// All buildings:
// https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/all_buildings.csv

// Whole Switzerland:
// https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/whole_switzerland.csv

createClock(
  (clock, data) => {
    const radius = clock.width * 0.5;

    const baseDemand = data["Base-demand"];

    const day6Index = 6;
    const day6 = baseDemand.slice(day6Index * 24, (day6Index + 1) * 24);

    const day7Index = 3;
    const day7 = baseDemand.slice(day7Index * 24, (day7Index + 1) * 24);

    const [remappedDay6, remappedDay7] = scaleTimeSeries(
      [day6, day7],
      radius * 0.5,
      radius * 0.8
    );

    clock.addRadialChart(remappedDay6, {
      fill: "#ff3b30",
      subdivisions: 5,
    });

    clock.addRadialChart(remappedDay7, {
      fill: "#ff9500",
      subdivisions: 5,
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
      "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/whole_switzerland.csv",
  }
);
