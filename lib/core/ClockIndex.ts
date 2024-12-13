import { createSvg, getSvgAsImageUrl } from "../utils/svg";
import { getFontDataUrl } from "../utils/fonts";
import { Layer } from "./Layer";
import { createId } from "@paralleldrive/cuid2";
import { Assets, Sprite } from "pixi.js";
import { Color, getHexColor } from "../utils/color";

/**
 * Parameters for text shape creation
 * @typedef {Object} TextShapeParams
 * @property {string} [text] - Text content to display
 * @property {string} [fontUrl] - URL of the font file to use
 * @property {number} [fontSize] - Font size in pixels
 * @property {string} [fill] - Text color
 * @property {number} [offset] - Offset from default position
 */
export type TextShapeParams = {
  /** Text content to display */
  text?: string;
  /** URL of the font file to use */
  fontUrl?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Color in RGBA format, HEX or CSS color */
  tint?: Color;
  /** Alias for tint */
  fill?: Color;
  /** Offset from the edge of the clock */
  offset?: number;
};

/**
 * Parameters for rectangle shape creation
 * @typedef {Object} RectShapeParams
 * @property {number} [width] - Width in pixels
 * @property {number} [height] - Height in pixels
 * @property {string} [fill] - Fill color
 * @property {number} [offset] - Offset from default position
 */
export type RectShapeParams = {
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Color in RGBA format, HEX or CSS color */
  tint?: Color;
  /** Alias for tint */
  fill?: Color;
  /** Offset from the edge of the clock */
  offset?: number;
};

/**
 * Parameters for circle shape creation
 * @typedef {Object} CircleShapeParams
 * @property {number} [radius] - Radius in pixels
 * @property {string} [fill] - Fill color
 * @property {number} [offset] - Offset from default position
 */
export type CircleShapeParams = {
  /** Radius in pixels */
  radius?: number;
  /** Color in RGBA format, HEX or CSS color */
  tint?: Color;
  /** Alias for tint */
  fill?: Color;
  /** Offset from the edge of the clock */
  offset?: number;
};

/**
 * Parameters for plain circle creation
 * @typedef {Object} PlainCircleParams
 * @property {number} [segments] - Number of segments in the circle
 * @property {number} [radius] - Radius of the circle
 * @property {Object} [tint] - Color tint configuration
 * @property {number} [tint.r] - Red component (0-255)
 * @property {number} [tint.g] - Green component (0-255)
 * @property {number} [tint.b] - Blue component (0-255)
 * @property {number} [tint.a] - Alpha component (0-255)
 */
export type PlainCircleParams = {
  segments?: number;
  radius?: number;
};

/**
 * Parameters for triangle shape creation
 * @typedef {Object} TriangleShapeParams
 * @property {number} [width] - Width of the triangle base
 * @property {number} [height] - Height from base to apex
 * @property {string} [fill] - Fill color
 * @property {number} [offset] - Offset from default position
 */
export type TriangleShapeParams = {
  /** Width of the triangle base */
  width?: number;
  /** Height from base to apex */
  height?: number;
  /** Color in RGBA format, HEX or CSS color */
  tint?: Color;
  /** Alias for tint */
  fill?: Color;
  /** Offset from the edge of the clock */
  offset?: number;
};

/**
 * Function type for custom shape generation
 * @callback CustomShapeHandler
 * @param {number} index - Current index in the sequence
 * @param {ClockIndex} instance - Reference to the Index instance
 * @returns {Promise<Node|undefined>} Generated SVG node
 */
export type CustomShapeHandler = (
  index: number,
  instance: ClockIndex
) => Promise<Node | undefined> | Node | undefined;

/**
 * Union type for different shape configurations
 */
export type ShapeParams =
  | {
      type: "circle";
      params?: CircleShapeParams;
    }
  | {
      type: "triangle";
      params?: TriangleShapeParams;
    }
  | {
      type: "rect";
      params?: RectShapeParams;
    }
  | {
      type: "text";
      params?: TextShapeParams;
    };

/**
 * Configuration options for Index component
 */
export type IndexProps = {
  /** Number of shapes to generate */
  count: number;
  /** Optional label for the index */
  label?: string;
  /** Offset from the center */
  offset?: number;
  /** Width of bounding box */
  boxWidth?: number;
  /** Height of bounding box */
  boxHeight?: number;
  /** Radius for circular arrangement */
  radius?: number;
  /** Shape configuration or custom handler */
  shape:
    | ShapeParams
    | {
        type: "custom";
        handler: CustomShapeHandler;
      };
};

/** Store for loaded fonts */
const globalFonts = new Map<string, string>();

/**
 * Component that creates and manages indexed arrangements of shapes
 * @extends Layer
 */
export class ClockIndex extends Layer {
  private radius = 50;
  private svg: SVGSVGElement;
  private boxWidth: number;
  private boxHeight: number;
  private offset: number;

  /**
   * Creates a new ClockIndex instance
   * @param {IndexProps} params - Configuration options
   */
  constructor(params: IndexProps) {
    super();

    if (params.label) {
      this.label = params.label;
    }

    this.offset = params.offset || 0;
    this.boxWidth = params.boxWidth || 100;
    this.boxHeight = params.boxHeight || 100;
    this.radius = params.radius || this.boxWidth * 0.5;

    this.svg = createSvg({
      width: this.boxWidth * window.devicePixelRatio,
      height: this.boxHeight * window.devicePixelRatio,
      viewBox: `0 0 ${this.boxWidth} ${this.boxHeight}`,
    });

    (async () => {
      const step = 360 / params.count;
      for (let i = 0; i < params.count; i++) {
        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        group.setAttribute(
          "transform",
          `translate(${this.boxWidth * 0.5}, ${this.boxHeight * 0.5}) rotate(${
            i * step
          })`
        );

        this.svg.appendChild(group);

        if (params.shape.type === "custom") {
          const result = params.shape.handler(i, this);
          const shape = result instanceof Promise ? await result : result;
          if (shape) {
            group.appendChild(shape);
          }
        } else {
          const shape = await this.createShape({ ...params.shape, index: i });
          if (shape) {
            group.appendChild(shape);
          }
        }
      }

      const svgUrl = getSvgAsImageUrl(this.svg);
      const texture = await Assets.load(svgUrl);
      const sprite = new Sprite(texture);
      sprite.width = this.boxWidth;
      sprite.height = this.boxHeight;
      sprite.anchor.set(0.5, 0.5);
      this.addChild(sprite);
    })();
  }

  /**
   * Creates a shape based on type and parameters
   * @private
   */
  private async createShape({
    type,
    params,
    index,
  }: ShapeParams & { index: number }) {
    const shape =
      type === "circle"
        ? this.createCircleElement(params)
        : type === "rect"
        ? this.createRectElement(params)
        : type === "text"
        ? this.createTextElement({
            ...(params || {}),
            text: params?.text || index.toString(),
          })
        : this.createTriangleElement(params);

    return shape;
  }

  /**
   * Creates an SVG text element with custom font support
   * @param {TextShapeParams} [params] - Text configuration options
   * @returns {Promise<SVGTextElement>} The created text element
   */
  async createTextElement(params?: TextShapeParams) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    const fontUrl =
      params?.fontUrl ||
      "https://raw.githubusercontent.com/PTRRR/energy-clock-lib/main/assets/fonts/Unica77LL-Bold.otf";

    if (!globalFonts.has(fontUrl)) {
      const fontId = `font-${createId()}`;
      const font = await getFontDataUrl(fontUrl);

      const loadMediaEvent = new CustomEvent("load-media", {
        detail: {
          url: fontUrl,
        },
      });

      document.dispatchEvent(loadMediaEvent);
      const style = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "style"
      );

      style.innerHTML = `
        @font-face {
          font-family: ${fontId};
          src: url(${font});
        }
      `;

      this.svg.appendChild(style);
      globalFonts.set(fontUrl, fontId);
    }

    text.setAttribute("font-family", globalFonts.get(fontUrl) as string);
    text.setAttribute("font-size", (params?.fontSize || 12).toString());
    text.setAttribute(
      "fill",
      getHexColor(params?.fill || params?.tint) || "white"
    );
    text.setAttribute("x", "0");
    text.setAttribute(
      "y",
      (-this.radius + this.offset + (params?.offset || 0)).toString()
    );
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = params?.text || "";

    return text;
  }

  /**
   * Creates an SVG rectangle element
   * @param {RectShapeParams} [params] - Rectangle configuration options
   * @returns {SVGRectElement} The created rectangle element
   */
  createRectElement(params?: RectShapeParams) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("width", (params?.width || 5).toString());
    rect.setAttribute("height", (params?.height || 5).toString());
    rect.setAttribute(
      "fill",
      getHexColor(params?.fill || params?.tint) || "white"
    );
    rect.setAttribute("x", ((params?.width || 5) * -0.5).toString());
    rect.setAttribute(
      "y",
      (-this.radius + this.offset - (params?.offset || 0)).toString()
    );

    return rect;
  }

  /**
   * Creates an SVG circle element
   * @param {CircleShapeParams} [params] - Circle configuration options
   * @returns {SVGCircleElement} The created circle element
   */
  createCircleElement(params?: CircleShapeParams) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("r", (params?.radius || 2.5).toString());
    circle.setAttribute(
      "fill",
      getHexColor(params?.fill || params?.tint) || "white"
    );
    circle.setAttribute("cx", "0");
    circle.setAttribute(
      "cy",
      (this.radius - this.offset - (params?.offset || 0)).toString()
    );

    return circle;
  }

  /**
   * Creates an SVG triangle element using polygon
   * @param {TriangleShapeParams} [params] - Triangle configuration options
   * @returns {SVGPolygonElement} The created triangle element
   */
  createTriangleElement(params?: TriangleShapeParams) {
    const triangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    const x1 = -(params?.width || 5) * 0.5;
    const y1 = this.radius - this.offset - (params?.offset || 0);

    const x2 = (params?.width || 5) * 0.5;
    const y2 = this.radius - this.offset - (params?.offset || 0);

    const x3 = 0;
    const y3 =
      this.radius - (params?.height || 5) - this.offset - (params?.offset || 0);

    triangle.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    triangle.setAttribute(
      "fill",
      getHexColor(params?.fill || params?.tint) || "white"
    );

    return triangle;
  }
}
