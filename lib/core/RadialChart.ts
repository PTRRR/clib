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
 * Configuration options for RadialChart visualization
 */
export type RadialChartOptions = {
  /** Optional label for the chart */
  label?: string;
  /** Number of samples for path resampling (3-5000) */
  samples?: number;
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

    const polarValues = mapPolarPathToValues(path);
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
