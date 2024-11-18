import { createNoise2D } from "simplex-noise";
import { Values } from "../types";

export const generatePolarSimplexNoiseValues = (
  count: number,
  radius: number = 1,
  seed: number = Math.random()
): Values => {
  const step = (2 * Math.PI) / count;
  const noise2D = createNoise2D(() => seed);

  const values: Values = [];
  for (let i = 0; i < count; i++) {
    const angle = i * step;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const noiseValue = noise2D(x, y);
    values.push(noiseValue);
  }

  return values;
};
