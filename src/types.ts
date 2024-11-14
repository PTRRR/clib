export type Values = number[];
export type Point = [number, number];
export type Path = Point[];

export type RadialChartOptions = {
  samples?: number;
  subdivisions?: number;
  vertexShader?: string;
  fragmentShader?: string;
};
