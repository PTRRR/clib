import { Tint } from "../types";

export const convertTintToNormalizedVector = (tint?: Tint) => {
  const { r, g, b, a } = tint || {};
  return [
    typeof r === "number" ? r / 255 : 1,
    typeof g === "number" ? g / 255 : 1,
    typeof b === "number" ? b / 255 : 1,
    typeof a === "number" ? a / 255 : 1,
  ];
};
