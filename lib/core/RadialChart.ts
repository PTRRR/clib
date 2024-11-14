import { Geometry, Mesh, Shader } from "pixi.js";
import { Layer } from "./Layer";
import { Values } from "../types";
import { clampValue } from "../utils/math";
import {
  mapPolarPathToValues,
  mapValuesToPolarPath,
  resampleClosedPath,
  subdivideClosedPath,
} from "../utils/path";
import { createRadialMeshGeometry } from "../utils/geometry";
import { baseFragmentShader, baseVertexShader } from "../utils/shader";

export type RadialChartOptions = {
  samples?: number;
  subdivisions?: number;
  vertexShader?: string;
  fragmentShader?: string;
};

export class RadialChart extends Layer {
  private geometry: Geometry;
  private mesh: Mesh<Geometry, Shader>;

  constructor(values: Values, params?: RadialChartOptions) {
    super();
    const { subdivisions, vertexShader, fragmentShader, samples } =
      params || {};

    const clampedSubdivisions = subdivisions
      ? clampValue(subdivisions, 0, 10)
      : 0;

    const clampedSamples = samples ? clampValue(samples, 3, 1000) : 300;

    // Process values
    const polarPath = mapValuesToPolarPath(values);
    const subdividedPath = subdivideClosedPath(polarPath, clampedSubdivisions);
    const resampledPath = resampleClosedPath(subdividedPath, clampedSamples);
    const polarValues = mapPolarPathToValues(resampledPath);

    // Generate geometry attributes
    const distanceAttribute: Values = [];
    const valueAttribute: Values = [];

    for (let i = 0; i < polarValues.length; i++) {
      distanceAttribute.push(0, 1, 1);

      const value = polarValues[i];
      const nextValue =
        i + 1 < polarValues.length ? polarValues[i + 1] : polarValues[0];

      valueAttribute.push(0, value, nextValue);
    }

    this.geometry = createRadialMeshGeometry(polarValues);

    this.geometry.addAttribute("aDistance", {
      buffer: distanceAttribute,
    });

    this.geometry.addAttribute("aValue", {
      buffer: valueAttribute,
    });

    const shader = Shader.from({
      gl: {
        vertex: vertexShader || baseVertexShader,
        fragment: fragmentShader || baseFragmentShader,
      },
    });

    this.mesh = new Mesh<Geometry, Shader>({
      geometry: this.geometry,
      shader,
    });

    this.addChild(this.mesh);
  }
}
