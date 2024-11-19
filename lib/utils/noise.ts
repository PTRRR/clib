import { createNoise2D } from "simplex-noise";
import { Values } from "../types";

/**
 * Generates polar simplex noise values for circular data visualization
 * @param {number} count - Number of noise values to generate
 * @param {number} [radius=1] - Radius for sampling noise values
 * @param {number} [seed=Math.random()] - Seed for noise generation
 * @returns {Values} Array of generated noise values
 */
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
