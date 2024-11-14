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

    // Process values
    let path = mapValuesToPolarPath(values);

    if (typeof subdivisions === "number") {
      const clampedSubdivisions = clampValue(subdivisions, 0, 10);
      path = subdivideClosedPath(path, clampedSubdivisions);
    }

    if (typeof samples === "number") {
      const clampedSamples = clampValue(samples, 3, 5000);
      path = resampleClosedPath(path, clampedSamples);
    }

    const polarValues = mapPolarPathToValues(path);

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
