/*
 * Graphic Rodeo Workshop - Educational License
 * Fachklasse Grafik Luzern
 * For educational use only - See LICENSE for terms
 */

import { Step } from "optimo-animator";
import { Clock } from "../core/Clock";

/**
 * Creates default animation step for clock hands
 * Updates rotation of seconds, minutes and hours layers based on current time
 * @param {Clock} clock - Clock instance to animate
 * @returns {Step} Animation step configuration
 */
export const defaultClockStep = (clock: Clock): Step => ({
  duration: 1000,
  handler: () => {
    const date = new Date();
    const secondsProgress = date.getTime() / 1000 / 60;
    const minutesProgress = date.getTime() / 1000 / 60 / 60;
    const hoursProgress = date.getTime() / 1000 / 60 / 60 / 12 + 1 / 12;

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
