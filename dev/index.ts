import { createClock, scaleTimeSeries, scaleValues } from "../lib";

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

    const scale = 20;

    const day6Index = 6;
    const day6 = baseDemand.slice(day6Index * 4 * 24, (day6Index + 1) * 4 * 24);
    const scaledDay6 = scaleValues(day6, scale);

    const day12Index = 9;
    const day12 = baseDemand.slice(
      day12Index * 4 * 24,
      (day12Index + 1) * 4 * 24
    );
    const scaledDay12 = scaleValues(day12, scale);

    clock.addRadialChart(scaledDay6, {
      fill: "#ff3b30",
      subdivisions: 5,
      valuesOffset: 150,
    });

    clock.addRadialChart(scaledDay12, {
      fill: "green",
      subdivisions: 5,
      valuesOffset: 150,
      inverted: true,
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
