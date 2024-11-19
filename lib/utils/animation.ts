import { Step } from "optimo-animator";
import { Clock } from "../core/Clock";

export const defaultClockStep = (clock: Clock): Step => ({
  duration: 1000,
  handler: () => {
    const date = new Date();
    const secondsProgress = date.getTime() / 1000 / 60;
    const minutesProgress = date.getTime() / 1000 / 60 / 60;
    const hoursProgress = date.getTime() / 1000 / 60 / 60 / 12 + 1 / 12;

    // console.log(hoursProgress);

    const secondsLayers = clock.getLayersByLabel("seconds");
    const minutesLayers = clock.getLayersByLabel("minutes");
    const hourseLayers = clock.getLayersByLabel("hours");

    secondsLayers.forEach((layer) => {
      layer.rotation = secondsProgress * Math.PI * 2;
    });

    minutesLayers.forEach((layer) => {
      layer.rotation = minutesProgress * Math.PI * 2;
    });

    hourseLayers.forEach((layer) => {
      layer.rotation = hoursProgress * Math.PI * 2;
    });
  },
});
