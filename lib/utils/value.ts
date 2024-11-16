/**
 * Import required dependencies
 */
import { Values } from "../types";
import { remapValue } from "./math";

/**
 * Normalizes an array of values to a range of [0, 1]
 * @param {Values} values - Array of numerical values to normalize
 * @returns {Values} Array of normalized values, where the largest value becomes 1
 * and all other values are scaled proportionally
 * @description
 * Finds the maximum value in the array and divides all values by it, resulting in:
 * - All values will be in the range [0, 1]
 * - The largest value will become exactly 1
 * - The relative proportions between values are preserved
 * @example
 * normalizeValues([10, 20, 30]) // returns [0.333..., 0.666..., 1]
 */
export const normalizeValues = (values: Values) => {
  let maxValue = -Infinity;
  let minValue = Infinity;
  for (const value of values) {
    if (value < minValue) {
      minValue = value;
    }
    if (value > maxValue) {
      maxValue = value;
    }
  }
  return values.map((it) => remapValue(it, minValue, maxValue, 0, 1));
};

/**
 * Remaps an array of values from their current range to a new target range
 * @param {Values} values - Array of numerical values to remap
 * @param {number} low - Lower bound of the target range
 * @param {number} hight - Upper bound of the target range
 * @returns {Values} Array of remapped values scaled to the new range
 * @description
 * Process:
 * 1. First normalizes the values to [0, 1] range
 * 2. Then remaps each normalized value to the target range [low, hight]
 * The relative proportions between values are preserved in the new range
 * @example
 * remapValues([10, 20, 30], 0, 100) // remaps to [33.33..., 66.66..., 100]
 */
export const remapValues = (values: Values, low: number, hight: number) => {
  const normalized = normalizeValues(values);
  return normalized.map((it) => remapValue(it, 0, 1, low, hight));
};
