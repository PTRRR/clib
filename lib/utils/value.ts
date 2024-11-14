import { Values } from "../types";
import { remapValue } from "./math";

export const normalizeValues = (values: Values) => {
  let maxValue = -Infinity;

  for (const value of values) {
    if (value > maxValue) {
      maxValue = value;
    }
  }

  return values.map((it) => it / maxValue);
};

export const remapValues = (values: Values, low: number, hight: number) => {
  const normalized = normalizeValues(values);
  return normalized.map((it) => remapValue(it, 0, 1, low, hight));
};
