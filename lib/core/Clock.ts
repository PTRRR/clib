import { Application } from "pixi.js";
import { Layer } from "./Layer";
import { Values } from "../types";
import { RadialChart, RadialChartOptions } from "./RadialChart";

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

  addLayer(layer: Layer) {
    this.scene.addChild(layer);
    return this;
  }

  addRadialChart(values: Values, options?: RadialChartOptions) {
    const radialChart = new RadialChart(values, options);
    this.addLayer(radialChart);
    return this;
  }
}
