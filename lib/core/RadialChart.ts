/**
 * Import required dependencies from PIXI.js and local modules
 */
import {
  Assets,
  ContainerChild,
  ContainerOptions,
  Geometry,
  Mesh,
  Shader,
} from "pixi.js";
import { Layer } from "./Layer";
import { BlendMode, RequiredBy, Values } from "../types";
import { clampValue } from "../utils/math";
import { convertTintToNormalizedVector } from "../utils/color";
import {
  mapPolarPathToValues,
  mapValuesToPolarPath,
  mapValueToPolar,
  resampleClosedPath,
  subdivideClosedPath,
} from "../utils/path";
import { createRadialMeshGeometry } from "../utils/geometry";
import {
  texturedFragmentShader,
  baseVertexShader,
  defaultFragmentShader,
} from "../utils/shader";
import { remapValues } from "../utils";

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
  blendMode?: ContainerOptions<ContainerChild>["blendMode"];
  texture?: string;
  resources?: Record<string, any>;
  tint?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
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

    // Create geometry and mesh for the radial chart
    this.createDefaultGeometry(values, params);

    // Load texture and create shader if texture is provided
    if (params?.texture) {
      this.createTexturedMesh({
        ...params,
        texture: params.texture,
      });
      return;
    }

    this.createDefaultMesh(params);
  }

  private createDefaultGeometry(values: Values, params?: RadialChartOptions) {
    const { subdivisions, samples } = params || {};
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
    const normalizedValueAttribute: Values = [];
    const valueAttribute: Values = [];
    const uvAttribute: Values = [];

    for (let i = 0; i < polarValues.length; i++) {
      const value = polarValues[i];
      const nextValue =
        i + 1 < polarValues.length ? polarValues[i + 1] : polarValues[0];
      const polarCoords = mapValueToPolar(value, i, polarValues.length);
      const nextPolarCoords = mapValueToPolar(
        nextValue,
        i + 1,
        polarValues.length
      );
      uvAttribute.push(
        0.5,
        0.5,
        polarCoords[0],
        polarCoords[1],
        nextPolarCoords[0],
        nextPolarCoords[1]
      );
      valueAttribute.push(0, value, nextValue);
      normalizedValueAttribute.push(0, 1, 1);
    }

    this.geometry = createRadialMeshGeometry(polarValues);
    this.geometry.addAttribute("aNormalizedValue", {
      buffer: normalizedValueAttribute,
    });
    this.geometry.addAttribute("aValue", {
      buffer: valueAttribute,
    });
    this.geometry.addAttribute("aUv", {
      buffer: remapValues(uvAttribute, 0, 1),
    });
  }

  private createTexturedMesh(
    params: RequiredBy<RadialChartOptions, "texture">
  ) {
    const { texture: textureUrl, vertexShader, fragmentShader, tint } = params;

    Assets.load(textureUrl).then((texture) => {
      const shader = Shader.from({
        gl: {
          vertex: vertexShader || baseVertexShader,
          fragment: fragmentShader || texturedFragmentShader,
        },
        resources: {
          ...(params?.resources || {}),
          uTexture: texture.source,
          globals: {
            uTint: {
              value: convertTintToNormalizedVector(tint),
              type: "vec4<f32>",
            },
          },
        },
      });

      this.mesh = new Mesh<Geometry, Shader>({
        geometry: this.geometry,
        shader,
        blendMode: params?.blendMode,
      });

      this.addChild(this.mesh);
    });
  }

  private createDefaultMesh(params?: RadialChartOptions) {
    const { vertexShader, fragmentShader, tint } = params || {};

    const shader = Shader.from({
      gl: {
        vertex: vertexShader || baseVertexShader,
        fragment: fragmentShader || defaultFragmentShader,
      },
      resources: {
        ...(params?.resources || {}),
        globals: {
          uTint: {
            value: convertTintToNormalizedVector(tint),
            type: "vec4<f32>",
          },
        },
      },
    });

    this.mesh = new Mesh<Geometry, Shader>({
      geometry: this.geometry,
      shader,
      blendMode: params?.blendMode,
    });

    this.addChild(this.mesh);
  }
}
