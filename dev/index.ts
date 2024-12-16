import { addValues, createClock, extractPeriod, scaleValues } from "../lib";

// Data URLs:

// Single building:
// https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/single_building.csv

// All buildings:
// https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/all_buildings.csv

// Whole Switzerland:
// https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/whole_switzerland.csv

createClock(
  (clock, data) => {
    const baseDemand = data["Base-demand"];

    const scale = 70;

    const day6 = extractPeriod(baseDemand, 4 * 24, 6);
    const scaledDay6 = scaleValues(day6, scale);

    const day12 = extractPeriod(baseDemand, 4 * 24, 9);
    const scaledDay12 = scaleValues(day12, scale);
    const added = addValues(scaledDay6, scaledDay12);

    const day16 = extractPeriod(baseDemand, 4 * 24, 16);
    const scaledDay16 = scaleValues(day16, scale);
    const added16 = addValues(scaledDay6, scaledDay12, scaledDay16);

    clock.addPlainCircle({
      radius: 250,
      outline: true,
      thickness: 1,
      fill: {
        r: 105,
        g: 105,
        b: 105,
        a: 0.0,
      },
    });

    clock.addPlainCircle({
      radius: 200,
      outline: true,
      thickness: 1,
      fill: {
        r: 105,
        g: 105,
        b: 105,
        a: 0.0,
      },
    });

    clock.addPlainCircle({
      radius: 150,
      outline: true,
      thickness: 1,
      fill: {
        r: 105,
        g: 105,
        b: 105,
        a: 0.0,
      },
    });

    clock.addPlainCircle({
      radius: 100,
      outline: true,
      thickness: 1,
      fill: {
        r: 105,
        g: 105,
        b: 105,
        a: 0.0,
      },
    });

    clock.addRadialChart(added16, {
      fill: "#ff9500",
      subdivisions: 5,
      valuesOffset: 50,
    });

    clock.addRadialChart(added, {
      fill: "#ff3b30",
      subdivisions: 5,
      valuesOffset: 50,
    });

    clock.addRadialChart(scaledDay6, {
      fill: "#5856d6",
      subdivisions: 5,
      valuesOffset: 50,
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
