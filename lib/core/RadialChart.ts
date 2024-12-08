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
import { clampValue, remapValue } from "../utils/math";
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
import { getMinMaxValues } from "../utils";

/**
 * Configuration options for RadialChart visualization
 */
export type RadialChartOptions = {
  /** Label for chart identification */
  label?: string;
  /** Sample count for path resampling (3-5000) */
  samples?: number;
  /** Distance from center point */
  centerOffset?: number;
  /** Whether centerOffset follows outer contour shape */
  relativeOffset?: boolean;
  /** Path subdivision count (0-10) for detail enhancement */
  subdivisions?: number;
  /** Custom GLSL vertex shader */
  vertexShader?: string;
  /** Custom GLSL fragment shader */
  fragmentShader?: string;
  /** PIXI blend mode for compositing */
  blendMode?: ContainerOptions<ContainerChild>["blendMode"];
  /** Texture image URL */
  texture?: string;
  /** Additional shader uniform resources */
  resources?: Record<string, any>;
  /** Color tint in RGBA format */
  tint?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  /** UV mapping bounds */
  boundingBox?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
};

/**
 * Renders circular/radial data visualizations using PIXI.js
 * @extends Layer
 *
 * @description
 * A flexible visualization component that creates radial/circular charts with:
 * - Path resampling and subdivision for smooth rendering
 * - Optional texture mapping with custom UV coordinates
 * - Customizable shaders and blend modes
 * - Color tinting and opacity control
 * - Angular masking for animated reveals
 * - Inner/outer contour generation with relative or absolute offsets
 *
 * The chart generates a quad mesh between two contours:
 * - Outer contour from input values
 * - Inner contour from centerOffset (either constant or following outer shape)
 *
 * Attributes generated for shading:
 * - aPosition: Vertex positions in 2D space
 * - aNormalizedValue: 0-1 values for inner/outer vertices
 * - aValue: Original data values at vertices
 * - aUv: Texture coordinates mapped to boundingBox
 */
export class RadialChart extends Layer {
  /** Geometry containing vertex data */
  geometry: Geometry;
  /** Mesh for rendering using geometry and shader */
  mesh: Mesh<Geometry, Shader>;

  /**
   * Creates a new RadialChart instance
   * @param {Values} values - Data points for outer contour
   * @param {RadialChartOptions} [params] - Visualization configuration
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
   * Creates geometry with processed paths and vertex attributes
   * @private
   * @param {Values} values - Input data values to visualize
   * @param {RadialChartOptions} [params] - Configuration options
   *
   * Processing steps:
   * 1. Convert values to polar coordinates
   * 2. Apply optional subdivision for smoother paths
   * 3. Resample path if sample count specified
   * 4. Generate inner contour based on centerOffset
   * 5. Create vertex buffers for position, value and UV data
   * 6. Build triangle indices for quad mesh
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

    const outerCoords = outerValues.map((value, i) =>
      mapValueToPolar(value, i, valuesCount)
    );

    const minOuterX = getMinMaxValues(outerCoords.map((it) => it[0])).minValue;
    const minOuterY = getMinMaxValues(outerCoords.map((it) => it[1])).minValue;
    const maxOuterX = getMinMaxValues(outerCoords.map((it) => it[0])).maxValue;
    const maxOuterY = getMinMaxValues(outerCoords.map((it) => it[1])).maxValue;

    const innerCoords = innerValues.map((value, i) =>
      mapValueToPolar(value, i, valuesCount)
    );

    const minInnerX = getMinMaxValues(innerCoords.map((it) => it[0])).minValue;
    const minInnerY = getMinMaxValues(innerCoords.map((it) => it[1])).minValue;
    const maxInnerX = getMinMaxValues(innerCoords.map((it) => it[0])).maxValue;
    const maxInnerY = getMinMaxValues(innerCoords.map((it) => it[1])).maxValue;

    const minX = params?.boundingBox?.minX ?? Math.min(minOuterX, minInnerX);
    const minY = params?.boundingBox?.minY ?? Math.min(minOuterY, minInnerY);
    const maxX = params?.boundingBox?.maxX ?? Math.max(maxOuterX, maxInnerX);
    const maxY = params?.boundingBox?.maxY ?? Math.max(maxOuterY, maxInnerY);

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
        remapValue(innerPolarCoords[0], minX, maxX, 0, 1),
        remapValue(innerPolarCoords[1], minY, maxY, 0, 1),
        remapValue(outerPolarCoords[0], minX, maxX, 0, 1),
        remapValue(outerPolarCoords[1], minY, maxY, 0, 1),
        remapValue(nextOuterPolarCoords[0], minX, maxX, 0, 1),
        remapValue(nextOuterPolarCoords[1], minY, maxY, 0, 1),
        remapValue(nextInnerPolarCoords[0], minX, maxX, 0, 1),
        remapValue(nextInnerPolarCoords[1], minY, maxY, 0, 1)
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
      buffer: uvAttribute,
    });
  }

  /**
   * Creates a textured mesh using specified shader configuration
   * @private
   * @param {RequiredBy<RadialChartOptions, "texture">} params - Configuration with required texture URL
   */
  private createTexturedMesh(
    params: RequiredBy<RadialChartOptions, "texture">
  ) {
    const { texture: textureUrl, vertexShader, fragmentShader, tint } = params;

    Assets.load(textureUrl).then((texture) => {
      console.log(texture);

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
            uRadialMaskStart: {
              value: 0.0,
              type: "f32",
            },
            uRadialMaskEnd: {
              value: 1,
              type: "f32",
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
   * Creates an untextured mesh with default shader configuration
   * @private
   * @param {RadialChartOptions} [params] - Optional visualization parameters
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
          uRadialMaskStart: {
            value: 0.0,
            type: "f32",
          },
          uRadialMaskEnd: {
            value: 1,
            type: "f32",
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

  /**
   * Sets angular mask for partial rendering of the chart
   * @param {number} start - Start angle in normalized range 0-1
   * @param {number} end - End angle in normalized range 0-1
   */
  public setRadialMask(start: number, end: number) {
    if (this.mesh && this.mesh.shader) {
      this.mesh.shader.resources.globals.uniforms.uRadialMaskStart = start;
      this.mesh.shader.resources.globals.uniforms.uRadialMaskEnd = end;
    }
  }
}
