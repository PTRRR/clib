export const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const remapValue = (
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};
