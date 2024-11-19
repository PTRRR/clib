import { Tint } from "../types";

/**
 * Converts RGBA tint values to normalized vector format (0-1 range)
 * @param {Tint} [tint] - RGBA color values (0-255 range)
 * @returns {number[]} Normalized RGBA values as array
 */
export const convertTintToNormalizedVector = (tint?: Tint) => {
  const { r, g, b, a } = tint || {};
  return [
    typeof r === "number" ? r / 255 : 1,
    typeof g === "number" ? g / 255 : 1,
    typeof b === "number" ? b / 255 : 1,
    typeof a === "number" ? a / 255 : 1,
  ];
};
