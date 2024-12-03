import {
  aggregateTimeSeries,
  Clock,
  getDay,
  RadialChart,
  remapValues,
} from "../lib";
import { defaultClockStep as currentTimeAnimation } from "../lib/utils/animation.ts";
import { loadData } from "../lib/utils/csv.ts";

(async () => {
  const container = document.querySelector(".clock") as HTMLElement;
  const clock = new Clock(container);
  await clock.initialize();

  const radius = clock.width * 0.5;

  const hourlyData = await loadData("./data/clock_data_V1.csv");
  const supplyFromGrid = hourlyData["Electricity-supply-from-grid"];
  const supplyPhotovoltaics = hourlyData["Electricity-supply-photovoltaics"];
  const supplyBatteriesDischarge =
    hourlyData["Electricity-supply-batteries-discharge"];
  const demandBase = hourlyData["Electricity-demand-base"];
  const demandBatteryCharge = hourlyData["Electricity-demand-batteries-charge"];
  const demandHeatPumps = hourlyData["Electricity-demand-heat-pumps"];
  const demandElectroMobility =
    hourlyData["Electricity-demand-electro-mobility"];

  const demandByDay = aggregateTimeSeries(demandBase, {
    aggregationType: "average",
    period: "day",
    startDate: new Date(),
  });

  const demandElectroMobilityByDay = aggregateTimeSeries(
    demandElectroMobility,
    {
      aggregationType: "average",
      period: "day",
      startDate: new Date(),
    }
  );

  // const electroMobilityDemand = remapValues(
  //   data["Electricity-demand-batteries-charge"].slice(0, 24),
  //   0,
  //   1
  // );

  // console.log(electroMobilityDemand);

  clock.addRadialChart(
    remapValues(supplyPhotovoltaics.slice(0, 24), radius * 0.1, radius),
    {
      subdivisions: 4,
      centerOffset: radius * 0.1,
      label: "photo",
      tint: {
        r: 255,
        g: 255,
        b: 255,
        a: 255,
      },
    }
  );

  clock.addRadialChart(
    remapValues(supplyFromGrid.slice(0, 24), radius * 0.1, radius),
    {
      subdivisions: 4,
      centerOffset: radius * 0.1,
      tint: {
        r: 255,
        g: 60,
        b: 0,
        a: 255,
      },
    }
  );

  clock.addRadialChart(
    remapValues(supplyPhotovoltaics.slice(0, 24), radius * 0.1, radius),
    {
      subdivisions: 4,
      centerOffset: radius * 0.1,
      blendMode: "multiply",
      label: "photo",
      tint: {
        r: 100,
        g: 60,
        b: 200,
        a: 255,
      },
    }
  );

  // console.log(remapValues(dayOfEnergySupplyPhotovoltaics, 200, 300));

  // console.log(dayOfEnergySupplyPhotovoltaics);

  // clock.addRadialChart(
  //   remapValues(dayOfEnergySupplyPhotovoltaics, radius * 0.25, radius * 0.4),
  //   {
  //     subdivisions: 3,

  //     blendMode: "add",
  //     centerOffset: radius * 0.25,
  //     tint: {
  //       r: 0,
  //       g: 60,
  //       b: 255,
  //       a: 255,
  //     },
  //   }
  // );

  // clock
  //   .addCircles({ count: 0, radius: 10, offset: 10 })
  //   .addRectangles({ count: 12, height: 100, width: 2, offset: 100 });

  // const energyDemandBase = hourlyData["Electricity-demand-electro-mobility"];
  // const dayOfEnergyDemandBase = getDay(0, energyDemandBase);

  // clock.addRadialChart(
  //   remapValues(dayOfEnergyDemandBase, radius * 0.4, radius * 0.55),
  //   {
  //     subdivisions: 3,
  //     blendMode: "add",
  //     centerOffset: radius * 0.4,
  //     tint: {
  //       r: 255,
  //       g: 195,
  //       b: 255,
  //       a: 255,
  //     },
  //   }
  // );

  // const energyHeatPumps = hourlyData["Electricity-demand-heat-pumps"];
  // const dayOfEnergyHeatPumps = getDay(0, energyHeatPumps);

  // clock.addRadialChart(
  //   remapValues(dayOfEnergyHeatPumps, radius * 0.55, radius * 0.7),
  //   {
  //     subdivisions: 3,
  //     blendMode: "add",
  //     label: "chart",
  //     centerOffset: radius * 0.55,
  //     // relativeOffset: true,
  //     tint: {
  //       r: 255,
  //       g: 195,
  //       b: 0,
  //       a: 255,
  //     },
  //   }
  // );

  clock.addTexts({ count: 24, offset: 80, fontSize: 20 });
  // // clock.addCircles({ count: 24, radius: 30, offset: 30 });

  clock.addCustomShape({
    count: 48,
    handler: async (index, instance) => {
      return index % 2 === 0
        ? instance.createRectElement({
            height: 50,
            width: 10,
          })
        : instance.createCircleElement({
            radius: 20,
            offset: 20,
          });
    },
  });

  clock.addHandle({
    label: "seconds",
    imageUrl: "./images/seconds.png",
    scale: 0.09,
    offsetY: -0.17,
  });

  const charts = clock.getLayersByLabel("photo") as RadialChart[];

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
