import {
  addTimeSeries,
  createClock,
  defaultClockStep,
  logTransform,
  scaleTimeSeries,
} from "../lib";

createClock((clock, data) => {
  const radius = clock.width * 0.5;

  const supplyFromGrid = data["Electricity-supply-from-grid"];
  const supplyFromGridHour = supplyFromGrid.slice(0, 24);

  const supplyPhoto = data["Electricity-supply-photovoltaics"];
  const supplyPhotoByHour = supplyPhoto.slice(0, 24);

  const demandElectroMobility = data["Electricity-demand-electro-mobility"];
  const demandElectroMobilityByHour = demandElectroMobility.slice(0, 24);

  const demandBase = data["Electricity-demand-base"];
  const demandBaseByHour = demandBase.slice(0, 24);

  const min = radius * 0.0;
  const supply = addTimeSeries([supplyFromGridHour, supplyPhotoByHour]);

  const [
    scaledSupply,
    scaledDemandElectroMobility,
    scaledElectroMobilityAndBase,
  ] = scaleTimeSeries(
    [
      supply.map((it) => logTransform(it)),
      demandElectroMobilityByHour.map((it) => logTransform(it)),
      addTimeSeries([demandElectroMobilityByHour, demandBaseByHour]).map((it) =>
        logTransform(it)
      ),
    ],
    min,
    radius * 0.85
  );

  clock.addRadialChart(scaledElectroMobilityAndBase, {
    subdivisions: 5,
    centerOffset: min,
    texture:
      "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/images/p-4.webp",
    tint: {
      r: 255,
      g: 183,
      b: 3,
      a: 255,
    },
  });

  clock.addRectangles({
    count: scaledSupply.length,
    width: 3,
    height: 30,
    offset: 20,
  });

  clock.addCustomShape({
    count: scaledSupply.length,
    handler: async (index, instance) => {
      return instance.createTextElement({
        text: `${index.toString().padStart(2, "0")}`,
        fontSize: 20,
        offset: 10,
      });
    },
  });

  clock.addHandle({
    imageUrl:
      "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/images/seconds.png",
    scale: 0.1,
    offsetY: -0.166,
    label: "seconds",
  });

  // Add minutes hand
  clock.addHandle({
    imageUrl:
      "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/images/minutes.png",
    scale: 0.1,
    offsetY: -0.166,
    label: "minutes",
  });

  // Add hours hand
  clock.addHandle({
    imageUrl:
      "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/images/hours.png",
    scale: 0.1,
    offsetY: -0.23,
    label: "hours",
  });

  // Add animation to move clock hands
  clock.addAnimation({
    duration: 3000,
    handler: (progress, delta) => {
      const step = defaultClockStep(clock);
      step.handler?.(progress, delta);
    },
  });
});
