/*
 * Graphic Rodeo Workshop - Educational License
 * Fachklasse Grafik Luzern
 * For educational use only - See LICENSE for terms
 */

/**
 * Clamps a number within a specified range
 * @param {number} value - The number to clamp
 * @param {number} min - The minimum allowed value
 * @param {number} max - The maximum allowed value
 * @returns {number} The clamped value, guaranteed to be between min and max
 * @description
 * If the value is less than min, returns min
 * If the value is greater than max, returns max
 * Otherwise returns the original value
 * @example
 * clampValue(5, 0, 10)   // returns 5
 * clampValue(-5, 0, 10)  // returns 0
 * clampValue(15, 0, 10)  // returns 10
 */
export const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Remaps a value from one range to another using linear interpolation
 * @param {number} value - The value to remap
 * @param {number} low1 - Lower bound of the source range
 * @param {number} high1 - Upper bound of the source range
 * @param {number} low2 - Lower bound of the target range
 * @param {number} high2 - Upper bound of the target range
 * @returns {number} The remapped value in the target range
 * @description
 * Uses the formula: low2 + (high2 - low2) * (value - low1) / (high1 - low1)
 * - If value equals low1, returns low2
 * - If value equals high1, returns high2
 * - Values between low1 and high1 are mapped proportionally
 * - Values outside source range are extrapolated
 * @example
 * remapValue(5, 0, 10, 0, 100)    // returns 50
 * remapValue(7.5, 0, 10, 0, 100)  // returns 75
 * remapValue(0.5, 0, 1, -10, 10)  // returns 0
 */
export const remapValue = (
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};
