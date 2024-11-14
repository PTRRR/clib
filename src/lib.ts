import { Application, Container, Geometry, Mesh, Shader } from "pixi.js";
import { createRadialMeshGeometry } from "./utils/geometry";
import { baseFragmentShader, baseVertexShader } from "./utils/shader";

export class Clock extends Application {
  async initialize() {
    await this.init({ background: "#000000" });
    document.body.appendChild(this.canvas);
  }

  addLayer(layer: Layer) {
    this.stage.addChild(layer);
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

export class Layer extends Container {}

export class RadialChart extends Layer {
  public data: number[];
  private geometry: Geometry;
  private mesh: Mesh<Geometry, Shader>;

  constructor(params: { data: number[]; radius?: number; shader?: Shader }) {
    super();
    this.data = params.data;

    this.geometry = createRadialMeshGeometry({
      segments: 100,
      radius: params.radius || 100,
    });

    const shader =
      params.shader ||
      Shader.from({
        gl: {
          vertex: baseVertexShader,
          fragment: baseFragmentShader,
        },
      });

    this.mesh = new Mesh<Geometry, Shader>({
      geometry: this.geometry,
      shader,
    });

    this.addChild(this.mesh);
  }
}

// export class
