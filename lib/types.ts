export type Values = number[];
export type Point = [number, number];
export type Path = Point[];
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
