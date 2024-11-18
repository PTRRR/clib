export type Values = number[];
export type Point = [number, number];
export type Path = Point[];
export type Tint = {
  r: number;
  g: number;
  b: number;
  a: number;
};
export type BlendMode =
  | "normal"
  | "add"
  | "screen"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "linear-burn"
  | "linear-dodge"
  | "linear-light"
  | "hard-light"
  | "soft-light"
  | "pin-light"
  | "difference"
  | "exclusion"
  | "overlay"
  | "saturation"
  | "color"
  | "luminosity"
  | "add-npm"
  | "subtract"
  | "divide"
  | "vivid-light"
  | "hard-mix"
  | "negation";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
