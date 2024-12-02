import { Clock, getDay, RadialChart, remapValues } from "../lib";
import { defaultClockStep as currentTimeAnimation } from "../lib/utils/animation.ts";
import { loadData } from "../lib/utils/csv.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  const data = await loadData("./data/clock_data_V1.csv");

  const energySupplyFromGrid = data["Electricity-supply-from-grid"];
  const dayOfEnergySupply = getDay(0, energySupplyFromGrid);

  const energySupplyPhotovoltaics = data["Electricity-supply-photovoltaics"];
  const dayOfEnergySupplyPhotovoltaics = getDay(0, energySupplyPhotovoltaics);

  // const electroMobilityDemand = remapValues(
  //   data["Electricity-demand-batteries-charge"].slice(0, 24),
  //   0,
  //   1
  // );

  // console.log(electroMobilityDemand);

  clock.addRadialChart(remapValues(dayOfEnergySupply, 50, 100), {
    subdivisions: 3,
    centerOffset: 50,
    tint: {
      r: 255,
      g: 60,
      b: 0,
      a: 255,
    },
  });

  // console.log(remapValues(dayOfEnergySupplyPhotovoltaics, 200, 300));

  console.log(dayOfEnergySupplyPhotovoltaics);

  clock.addRadialChart(remapValues(dayOfEnergySupplyPhotovoltaics, 150, 200), {
    subdivisions: 3,

    blendMode: "add",
    centerOffset: 150,
    tint: {
      r: 0,
      g: 60,
      b: 255,
      a: 255,
    },
  });

  clock
    .addCircles({ count: 0, radius: 10, offset: 10 })
    .addRectangles({ count: 12, height: 100, width: 2, offset: 100 });

  const energyDemandBase = data["Electricity-demand-electro-mobility"];
  const dayOfEnergyDemandBase = getDay(0, energyDemandBase);

  clock.addRadialChart(remapValues(dayOfEnergyDemandBase, 100, 150), {
    subdivisions: 3,
    blendMode: "add",
    centerOffset: 100,
    tint: {
      r: 255,
      g: 195,
      b: 255,
      a: 255,
    },
  });

  const energyHeatPumps = data["Electricity-demand-heat-pumps"];
  const dayOfEnergyHeatPumps = getDay(0, energyHeatPumps);

  clock.addRadialChart(remapValues(dayOfEnergyHeatPumps, 200, 250), {
    subdivisions: 3,
    blendMode: "add",
    label: "chart",
    centerOffset: 200,
    // relativeOffset: true,
    tint: {
      r: 255,
      g: 195,
      b: 0,
      a: 255,
    },
  });

  clock.addTexts({ count: 24, offset: 60, fontSize: 40 });

  clock.addHandle({
    label: "seconds",
    imageUrl: "./images/seconds.png",
    scale: 0.09,
    offsetY: -0.17,
  });

  const charts = clock.getLayersByLabel("chart") as RadialChart[];

  clock.addAnimation({
    duration: 5000,
    handler(progress, delta) {
      const step = currentTimeAnimation(clock);
      step.handler?.(progress, delta);

      const date = new Date();
      charts.forEach((chart) => {
        chart.setRadialMask(0.0, ((date.getTime() / 1000) % 60) / 60);
      });
    },
  });
})();
