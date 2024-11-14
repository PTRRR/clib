/**
 * Import required dependencies from PIXI.js and local modules
 */
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

/**
 * Configuration options for the RadialChart
 * @typedef {Object} RadialChartOptions
 * @property {number} [samples] - Number of samples for path resampling. Value will be clamped between 3 and 5000
 * @property {number} [subdivisions] - Number of subdivisions for path subdivision. Value will be clamped between 0 and 10
 * @property {string} [vertexShader] - Custom vertex shader code. If not provided, uses baseVertexShader
 * @property {string} [fragmentShader] - Custom fragment shader code. If not provided, uses baseFragmentShader
 */
export type RadialChartOptions = {
  samples?: number;
  subdivisions?: number;
  vertexShader?: string;
  fragmentShader?: string;
};

/**
 * RadialChart class for rendering circular/radial data visualizations
 * Extends the Layer class and uses PIXI.js for rendering
 * @extends Layer
 */
export class RadialChart extends Layer {
  /** The geometry containing vertex data for the radial chart */
  private geometry: Geometry;

  /** The mesh that renders the radial chart using the geometry and shader */
  private mesh: Mesh<Geometry, Shader>;

  /**
   * Creates a new RadialChart instance
   * @param {Values} values - The data values to be visualized in the radial chart
   * @param {RadialChartOptions} [params] - Optional configuration parameters for the chart
   * @param {number} [params.samples] - Number of samples for path resampling
   * @param {number} [params.subdivisions] - Number of subdivisions for path subdivision
   * @param {string} [params.vertexShader] - Custom vertex shader code
   * @param {string} [params.fragmentShader] - Custom fragment shader code
   */
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
