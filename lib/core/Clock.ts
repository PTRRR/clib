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
  ClockIndex,
  IndexProps,
  RectShapeParams,
  TextShapeParams,
  TriangleShapeParams,
} from "./ClockIndex";
import { Animator, Step, Timeline } from "optimo-animator";

/**
 * Parameters for index-based shape generation methods
 * @typedef {Object} IndexHelperParams
 * @property {number} count - Number of shapes to generate
 * @property {number} [offset] - Optional offset for shape positioning
 * @property {string} [label] - Optional label for the index
 */
export type IndexHelperParams = {
  count: number;
  offset?: number;
  label?: string;
};

/**
 * A Canvas-based clock visualization component built on PIXI.js
 * Supports various graphical elements like charts, handles, and shapes
 * @extends Application
 */
export class Clock extends Application {
  /** Main scene layer containing all visual elements */
  private scene: Layer;
  /** Container element for the clock */
  private container: HTMLElement | undefined;
  /** Animation steps for the clock */
  private steps: Step[];
  /** Animator instance for handling animations */
  private animator: Animator | undefined;

  /**
   * Creates a new Clock instance
   * @param {HTMLElement} [container] - Optional container element to mount the clock
   */
  constructor(container?: HTMLElement) {
    super();
    this.container = container;
    this.steps = [];
  }

  /**
   * Initializes the clock application with canvas setup and main scene
   * @async
   * @returns {Promise<Clock>} The initialized Clock instance
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
    return this;
  }

  /** Gets the current width of the application screen, scaled to 95% */
  get width() {
    return this.screen.width * 0.95;
  }

  /** Gets the current height of the application screen, scaled to 95% */
  get height() {
    return this.screen.height * 0.95;
  }

  /** Gets the center coordinates of the application screen */
  get center() {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  /**
   * Adds a new layer to the main scene
   * @param {Layer} layer - Layer to add
   * @returns {Clock} The Clock instance for chaining
   */
  addLayer(layer: Layer) {
    this.scene.addChild(layer);
    return this;
  }

  /**
   * Creates and adds a RadialChart to the clock
   * @param {Values} values - Values to display in the chart
   * @param {RadialChartOptions} [options] - Configuration options
   * @returns {Clock} The Clock instance for chaining
   */
  addRadialChart(values: Values, options?: RadialChartOptions) {
    const radialChart = new RadialChart(values, options);
    this.addLayer(radialChart);
    return this;
  }

  /**
   * Adds a handle component to the clock
   * @param {HandleProps} options - Handle configuration options
   * @returns {Clock} The Clock instance for chaining
   */
  addHandle(options: HandleProps) {
    const handle = new Handle(options);
    this.addLayer(handle);
    return this;
  }

  /**
   * Adds an index component to the clock
   * @param {IndexProps} options - Index configuration options
   * @returns {Clock} The Clock instance for chaining
   */
  addIndex(options: IndexProps) {
    const index = new ClockIndex({
      boxWidth: this.width,
      boxHeight: this.height,
      ...options,
    });
    this.addLayer(index);
    return this;
  }

  /**
   * Adds rectangular shapes in an indexed arrangement
   * @param {RectShapeParams & IndexHelperParams} options - Rectangle and index configuration
   * @returns {Clock} The Clock instance for chaining
   */
  addRectangles(options: RectShapeParams & IndexHelperParams) {
    const index = new ClockIndex({
      boxWidth: this.width,
      boxHeight: this.height,
      label: options.label,
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

  /**
   * Adds triangular shapes in an indexed arrangement
   * @param {TriangleShapeParams & IndexHelperParams} options - Triangle and index configuration
   * @returns {Clock} The Clock instance for chaining
   */
  addTriangles(options: TriangleShapeParams & IndexHelperParams) {
    const index = new ClockIndex({
      boxWidth: this.width,
      boxHeight: this.height,
      label: options.label,
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

  /**
   * Adds circular shapes in an indexed arrangement
   * @param {CircleShapeParams & IndexHelperParams} options - Circle and index configuration
   * @returns {Clock} The Clock instance for chaining
   */
  addCircles(options: CircleShapeParams & IndexHelperParams) {
    const index = new ClockIndex({
      boxWidth: this.width,
      boxHeight: this.height,
      label: options.label,
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

  /**
   * Adds text elements in an indexed arrangement
   * @param {TextShapeParams & IndexHelperParams} options - Text and index configuration
   * @returns {Clock} The Clock instance for chaining
   */
  addTexts(options: TextShapeParams & IndexHelperParams) {
    const index = new ClockIndex({
      boxWidth: this.width,
      boxHeight: this.height,
      label: options.label,
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

  /**
   * Adds custom shapes using a provided handler function
   * @param {Object} options - Custom shape configuration
   * @param {number} options.count - Number of shapes to generate
   * @param {CustomShapeHandler} options.handler - Function to generate custom shapes
   * @param {number} [options.offset] - Optional position offset
   * @param {string} [options.label] - Optional label for the shapes
   * @returns {Clock} The Clock instance for chaining
   */
  addCustomShape(options: {
    count: number;
    handler: CustomShapeHandler;
    offset?: number;
    label?: string;
  }) {
    const index = new ClockIndex({
      boxWidth: this.width,
      boxHeight: this.height,
      label: options.label,
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

  /**
   * Adds an animation step to the clock
   * @param {Step} step - Animation step to add
   * @returns {Clock} The Clock instance for chaining
   */
  addAnimation(step: Step) {
    this.steps.push(step);

    if (this.animator) {
      this.animator.stop();
    }

    const timeline = new Timeline(this.steps);
    this.animator = new Animator([timeline]);
    this.animator.start();

    return this;
  }

  /**
   * Retrieves the first layer with the specified label
   * @param {string} label - Label to search for
   * @returns {Layer|undefined} The found layer or undefined
   */
  getLayerByLabel(label: string) {
    return this.scene.getChildByLabel(label, true) as Layer | undefined;
  }

  /**
   * Retrieves all layers with the specified label
   * @param {string} label - Label to search for
   * @returns {Layer[]} Array of matching layers
   */
  getLayersByLabel(label: string) {
    return this.scene.getChildrenByLabel(label, true) as Layer[];
  }
}
