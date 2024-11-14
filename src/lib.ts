import { Application, Container, Geometry, Mesh, Shader } from "pixi.js";
import { createRadialMeshGeometry } from "./utils/geometry";
import { baseFragmentShader, baseVertexShader } from "./utils/shader";
import {
  mapPolarPathToValues,
  mapValuesToPolarPath,
  resampleClosedPath,
  subdivideClosedPath,
} from "./utils/path";
import { clampValue } from "./utils/math";
import { RadialChartOptions, Values } from "./types";

export class Layer extends Container {}

export class Clock extends Application {
  private scene: Layer;

  async initialize() {
    await this.init({
      background: "#000000",
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    document.body.appendChild(this.canvas);

    this.scene = new Layer();
    this.scene.position.set(this.center.x, this.center.y);
    this.stage.addChild(this.scene);
  }

  addLayer(layer: Layer) {
    this.scene.addChild(layer);
    return this;
  }

  addRadialChart(values: Values, options?: RadialChartOptions) {
    const layer = new RadialChart(values, options);
    this.addLayer(layer);
    return this;
  }

  get width() {
    return this.screen.width;
  }

  get height() {
    return this.screen.height;
  }

  get center() {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }
}

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
