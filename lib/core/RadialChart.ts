import {
  Assets,
  ContainerChild,
  ContainerOptions,
  Geometry,
  Mesh,
  Shader,
} from "pixi.js";
import { Layer } from "./Layer";
import { RequiredBy, Values } from "../types";
import { clampValue } from "../utils/math";
import { convertTintToNormalizedVector } from "../utils/color";
import {
  mapPolarPathToValues,
  mapValuesToPolarPath,
  mapValueToPolar,
  resampleClosedPath,
  subdivideClosedPath,
} from "../utils/path";
import { createRingGeometry } from "../utils/geometry";
import {
  texturedFragmentShader,
  baseVertexShader,
  defaultFragmentShader,
} from "../utils/shader";
import { remapValues } from "../utils";

/**
 * Configuration options for RadialChart visualization
 */
export type RadialChartOptions = {
  /** Optional label for the chart */
  label?: string;
  /** Number of samples for path resampling (3-5000) */
  samples?: number;
  /** Offset for chart center positioning */
  centerOffset?: number;
  relativeOffset?: boolean;
  /** Number of subdivisions for path subdivision (0-10) */
  subdivisions?: number;
  /** Custom vertex shader code */
  vertexShader?: string;
  /** Custom fragment shader code */
  fragmentShader?: string;
  /** Blend mode for rendering */
  blendMode?: ContainerOptions<ContainerChild>["blendMode"];
  /** URL for texture to apply to the chart */
  texture?: string;
  /** Additional shader resources */
  resources?: Record<string, any>;
  /** RGBA tint color */
  tint?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
};

/**
 * Renders circular/radial data visualizations using PIXI.js
 * @extends Layer
 */
export class RadialChart extends Layer {
  /** Geometry containing vertex data */
  private geometry: Geometry;
  /** Mesh for rendering using geometry and shader */
  private mesh: Mesh<Geometry, Shader>;

  /**
   * Creates a new RadialChart instance
   * @param {Values} values - Data values to visualize
   * @param {RadialChartOptions} [params] - Configuration options
   */
  constructor(values: Values, params?: RadialChartOptions) {
    super();

    if (params?.label) {
      this.label = params.label;
    }

    this.createDefaultGeometry(values, params);

    if (params?.texture) {
      this.createTexturedMesh({
        ...params,
        texture: params.texture,
      });
      return;
    }

    this.createDefaultMesh(params);
  }

  /**
   * Creates the default geometry with processed values and attributes
   * @private
   * @param {Values} values - Input data values
   * @param {RadialChartOptions} [params] - Configuration options
   */
  private createDefaultGeometry(values: Values, params?: RadialChartOptions) {
    const { subdivisions, samples } = params || {};
    let path = mapValuesToPolarPath(values);

    if (typeof subdivisions === "number") {
      const clampedSubdivisions = clampValue(subdivisions, 0, 10);
      path = subdivideClosedPath(path, clampedSubdivisions);
    }

    if (typeof samples === "number") {
      const clampedSamples = clampValue(samples, 3, 5000);
      path = resampleClosedPath(path, clampedSamples);
    }

    const outerValues = mapPolarPathToValues(path);
    const innerValues = params?.relativeOffset
      ? outerValues.map((it) => it - (params.centerOffset || 0))
      : new Array(outerValues.length).fill(params?.centerOffset || 0);

    const normalizedValueAttribute: Values = [];
    const valueAttribute: Values = [];
    const uvAttribute: Values = [];

    const valuesCount = outerValues.length;
    for (let i = 0; i < valuesCount; i++) {
      const nextIndex = i + 1 < valuesCount ? i + 1 : 0;

      const outerValue = outerValues[i];
      const nextOuterValue = outerValues[nextIndex];

      const outerPolarCoords = mapValueToPolar(outerValue, i, valuesCount);
      const nextOuterPolarCoords = mapValueToPolar(
        nextOuterValue,
        nextIndex,
        valuesCount
      );

      const innerValue = innerValues[i];
      const nextInnerValue = innerValues[nextIndex];

      const innerPolarCoords = mapValueToPolar(innerValue, i, valuesCount);
      const nextInnerPolarCoords = mapValueToPolar(
        nextInnerValue,
        nextIndex,
        valuesCount
      );

      uvAttribute.push(
        innerPolarCoords[0],
        innerPolarCoords[1],
        outerPolarCoords[0],
        outerPolarCoords[1],
        nextOuterPolarCoords[0],
        nextOuterPolarCoords[1],
        nextInnerPolarCoords[0],
        nextInnerPolarCoords[1]
      );

      valueAttribute.push(
        innerValue,
        outerValue,
        nextOuterValue,
        nextInnerValue
      );

      normalizedValueAttribute.push(0, 1, 1, 0);
    }

    this.geometry = createRingGeometry(outerValues, innerValues);
    this.geometry.addAttribute("aNormalizedValue", {
      buffer: normalizedValueAttribute,
    });
    this.geometry.addAttribute("aValue", { buffer: valueAttribute });
    this.geometry.addAttribute("aUv", {
      buffer: remapValues(uvAttribute, 0, 1),
    });
  }

  /**
   * Creates a textured mesh with specified parameters
   * @private
   * @param {RequiredBy<RadialChartOptions, "texture">} params - Configuration with required texture
   */
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

  /**
   * Creates a default mesh with basic shader configuration
   * @private
   * @param {RadialChartOptions} [params] - Optional configuration parameters
   */
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
