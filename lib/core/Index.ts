import { createSvg, getSvgAsImage, getSvgAsImageUrl } from "../utils/svg";
import { getFontDataUrl } from "../utils/fonts";
import { Layer } from "./Layer";
import { createId } from "@paralleldrive/cuid2";
import { Assets, Sprite } from "pixi.js";

export type TextShapeParams = {
  text?: string;
  fontUrl?: string;
  fontSize?: number;
  fill?: string;
};

export type RectShapeParams = {
  width?: number;
  height?: number;
  fill?: string;
};

export type CircleShapeParams = {
  radius?: number;
  fill?: string;
};

export type TriangleShapeParams = {
  width?: number;
  height?: number;
  fill?: string;
};

export type CustomShapeHandler = (
  index: number,
  instance: Index
) => Promise<Node | undefined>;

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

export type IndexProps = {
  count: number;
  offset?: number;
  boxWidth?: number;
  boxHeight?: number;
  radius?: number;
  shape:
    | ShapeParams
    | {
        type: "custom";
        handler: CustomShapeHandler;
      };
};

const globalFonts = new Map<string, string>();

export class Index extends Layer {
  private radius = 50;
  private svg: SVGSVGElement;
  private boxWidth: number;
  private boxHeight: number;
  private offset: number;

  constructor(params: IndexProps) {
    super();

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

        const shapePromise =
          params.shape.type === "custom"
            ? params.shape.handler(i, this)
            : this.createShape({ ...params.shape, index: i });

        await shapePromise.then((shape) => {
          if (shape) {
            group.appendChild(shape);
          }
        });
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

  async createTextElement(params?: TextShapeParams) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    const fontUrl = params?.fontUrl || "/fonts/Unica77LL-Bold.otf";

    if (!globalFonts.has(fontUrl)) {
      const fontId = `font-${createId()}`;
      const font = await getFontDataUrl(fontUrl);
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
    text.setAttribute("fill", params?.fill || "white");
    text.setAttribute("x", "0");
    text.setAttribute("y", (-this.radius + this.offset).toString());
    text.setAttribute("transform", "rotate(180deg, 0, 0)");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = params?.text || "";

    return text;
  }

  createRectElement(params?: RectShapeParams) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("width", (params?.width || 5).toString());
    rect.setAttribute("height", (params?.height || 5).toString());
    rect.setAttribute("fill", params?.fill || "white");
    rect.setAttribute("x", ((params?.width || 5) * -0.5).toString());
    rect.setAttribute("y", (-this.radius + this.offset).toString());

    return rect;
  }

  createCircleElement(params?: CircleShapeParams) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("r", (params?.radius || 2.5).toString());
    circle.setAttribute("fill", params?.fill || "white");
    circle.setAttribute("cx", "0");
    circle.setAttribute("cy", (this.radius - this.offset).toString());

    return circle;
  }

  createTriangleElement(params?: TriangleShapeParams) {
    const triangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    const x1 = -(params?.width || 5) * 0.5;
    const y1 = this.radius - this.offset;

    const x2 = (params?.width || 5) * 0.5;
    const y2 = this.radius - this.offset;

    const x3 = 0;
    const y3 = this.radius - (params?.height || 5) - this.offset;

    triangle.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    triangle.setAttribute("fill", params?.fill || "white");

    return triangle;
  }
}
