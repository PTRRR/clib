/**
 * Import statements for required dependencies
 */
import { Application } from "pixi.js";
import { Layer } from "./Layer";
import { Values } from "../types";
import { RadialChart, RadialChartOptions } from "./RadialChart";
import { Handle, HandleProps } from "./Handle";
import {
  CircleShapeParams,
  CustomShapeHandler,
  Index,
  IndexProps,
  RectShapeParams,
  TextShapeParams,
  TriangleShapeParams,
} from "./Index";
import { Animator, Step, Timeline } from "optimo-animator";

export type IndexHelperParams = { count: number; offset?: number };

/**
 * A Clock class that extends PIXI.Application to create a canvas-based clock visualization
 * @extends Application
 */
export class Clock extends Application {
  /** The main scene layer that contains all visual elements */
  private scene: Layer;
  private container: HTMLElement | undefined;
  private steps: Step[];
  private animator: Animator | undefined;
  private handles: Handle[];

  constructor(container?: HTMLElement) {
    super();
    this.container = container;
    this.steps = [];
    this.handles = [];
  }

  /**
   * Initializes the clock application by setting up the canvas and main scene
   * @async
   * @returns {Promise<void>}
   */
  async initialize() {
    await this.init({
      background: "#000000",
      antialias: true,
      autoDensity: true,
      resizeTo: this.container,
      resolution: window.devicePixelRatio || 1,
      useBackBuffer: true,
    });

    if (this.container) {
      this.container.appendChild(this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }

    this.scene = new Layer();
    this.scene.position.set(this.screen.width * 0.5, this.screen.height * 0.5);
    this.stage.addChild(this.scene);
  }

  /**
   * Gets the current width of the application screen
   * @returns {number} The width in pixels
   */
  get width() {
    return this.screen.width * 0.95;
  }

  /**
   * Gets the current height of the application screen
   * @returns {number} The height in pixels
   */
  get height() {
    return this.screen.height * 0.95;
  }

  /**
   * Gets the center coordinates of the application screen
   * @returns {{ x: number, y: number }} An object containing the x and y coordinates of the center
   */
  get center() {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  /**
   * Adds a new layer to the main scene
   * @param {Layer} layer - The layer to be added
   * @returns {this} Returns the Clock instance for method chaining
   */
  addLayer(layer: Layer) {
    this.scene.addChild(layer);
    return this;
  }

  /**
   * Creates and adds a new RadialChart to the clock
   * @param {Values} values - The values to be displayed in the radial chart
   * @param {RadialChartOptions} [options] - Optional configuration options for the radial chart
   * @returns {this} Returns the Clock instance for method chaining
   */
  addRadialChart(values: Values, options?: RadialChartOptions) {
    const radialChart = new RadialChart(values, options);
    this.addLayer(radialChart);
    return this;
  }

  addHandle(options: HandleProps) {
    const handle = new Handle(options);
    this.addLayer(handle);
    return this;
  }

  addIndex(options: IndexProps) {
    const index = new Index({
      boxWidth: this.width,
      boxHeight: this.height,
      ...options,
    });
    this.addLayer(index);
    return this;
  }

  addRectangles(options: RectShapeParams & IndexHelperParams) {
    const index = new Index({
      boxWidth: this.width,
      boxHeight: this.height,
      count: options.count,
      offset: options.offset,
      shape: {
        type: "rect",
        params: options,
      },
    });

    this.addLayer(index);
    return this;
  }

  addTriangles(options: TriangleShapeParams & IndexHelperParams) {
    const index = new Index({
      boxWidth: this.width,
      boxHeight: this.height,
      count: options.count,
      offset: options.offset,
      shape: {
        type: "triangle",
        params: options,
      },
    });

    this.addLayer(index);
    return this;
  }

  addCircles(options: CircleShapeParams & IndexHelperParams) {
    const index = new Index({
      boxWidth: this.width,
      boxHeight: this.height,
      count: options.count,
      offset: options.offset,
      shape: {
        type: "circle",
        params: options,
      },
    });

    this.addLayer(index);
    return this;
  }

  addTexts(options: TextShapeParams & IndexHelperParams) {
    const index = new Index({
      boxWidth: this.width,
      boxHeight: this.height,
      count: options.count,
      offset: options.offset,
      shape: {
        type: "text",
        params: options,
      },
    });

    this.addLayer(index);
    return this;
  }

  addCustomShape(options: {
    count: number;
    handler: CustomShapeHandler;
    offset?: number;
  }) {
    const index = new Index({
      boxWidth: this.width,
      boxHeight: this.height,
      count: options.count,
      offset: options.offset,
      shape: {
        type: "custom",
        handler: options.handler,
      },
    });

    this.addLayer(index);
    return this;
  }

  addAnimationStep(step: Step) {
    this.steps.push(step);

    if (this.animator) {
      this.animator.stop();
    }

    const timeline = new Timeline(this.steps);
    this.animator = new Animator([timeline]);
    this.animator.start();
  }

  getLayerByLabel(label: string) {
    return this.scene.getChildByLabel(label, true) as Layer | undefined;
  }
}
