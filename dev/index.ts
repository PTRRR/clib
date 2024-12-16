/*
 * Graphic Rodeo Workshop - Educational License
 * Fachklasse Grafik Luzern
 * For educational use only - See LICENSE for terms
 */

// Import clock creation function
import { createClock, scaleValues, scaleTimeSeries, addValues } from "../lib";

createClock(
  (clock, data) => {
    const basedemand = data["Base-demand"];
    const scaledbasedemand = scaleValues(basedemand, 25);
    const EDay = scaledbasedemand.slice(17 * 24, 19 * 24);

    const hpeh = data["Heat-pumps-electrical-heaters"];
    const scaledhpeh = scaleValues(hpeh, 25);
    const SDay = scaledhpeh.slice(17 * 24, 19 * 24);
    const baseDemandAndHeatPump = addValues(EDay, SDay);

    const electromobility = data["Electro-mobility"];
    const scaledelectromobility = scaleValues(electromobility, 25);
    const SIDay = scaledelectromobility.slice(17 * 24, 19 * 24);
    const baseDemandAndHeatPumpAndElectromobility = addValues(
      EDay,
      SDay,
      SIDay
    );

    //const layer1Data =

    clock.addRadialChart(baseDemandAndHeatPumpAndElectromobility, {
      valuesOffset: 100,
      subdivisions: 5,
      fill: "#ff24d7",
    });

    clock.addRadialChart(baseDemandAndHeatPump, {
      valuesOffset: 100,
      subdivisions: 5,
      fill: "Green",
    });

    clock.addRadialChart(EDay, {
      valuesOffset: 100,
      subdivisions: 5,
      fill: "#0c155c",
    });

    //   //   const remappedimports = remapValues(
    //     imports,
    //     radius * 0.5, // Minimum size
    //     radius * 0.8 // Maximum size
    //   );

    //   //   const remappedexports = remapValues(
    //     exports,
    //     radius * 0.5, // Minimum size
    //     radius * 0.8 // Maximum size
    //   );

    //   const remappedStorageinput = remapValues(
    //     Storageinput,
    //     radius * 0.5, // Minimum size
    //     radius * 0.8 // Maximum size
    //   );

    //   const remappedStorageoutput = remapValues(
    //     storageoutput,
    //     radius * 0.5, // Minimum size
    //     radius * 0.8 // Maximum size
    //   );

    //   const [imports, exports, storageoutput, Storageinput] = scaleTimeSeries(
    //     [remappedimports, remappedexports, remappedStorageinput, remappedStorageoutput,],
    //     radius * 0.5, // Minimum size
    //     radius * 0.8 // Maximum size
    //   );

    // Add 24 rectangles evenly around clock
    clock.addTexts({
      count: 24,
      fontSize: 40,
      offset: 40,
    });
    clock.addHandle({
      imageUrl: "/api/clib/file/f444288uvwhpsqkoq5b2rv8q",
      scale: 0.1,
      offsetY: -0.166,
      label: "seconds",
    });
  },
  {
    // Tell the clock where to get its data from
    dataUrl:
      "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/data/whole_switzerland.csv",
  }
);
