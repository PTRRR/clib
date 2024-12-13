import { createClock, remapValues } from "../lib";

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

    const dayIndex = 6;
    const day = baseDemand.slice(dayIndex * 4 * 24, (dayIndex + 1) * 4 * 24);
    const remappedBaseDemand = remapValues(day, radius * 0.5, radius * 0.8);

    clock.addRadialChart(remappedBaseDemand, {
      fill: "#ff3b30",
      subdivisions: 5,
    });

    clock.addPlainCircle({
      radius: radius * 0.55,
      outline: true,
      thickness: 1,
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
