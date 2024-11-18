import { createSvg } from "../utils/svg";
import { getFontDataUrl } from "../utils/fonts";
import { Layer } from "./Layer";
import { createId } from "@paralleldrive/cuid2";

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
  radius?: number;
  shape:
    | ShapeParams
    | {
        type: "custom";
        handler: (index: number, instance: Index) => Promise<Node | undefined>;
      };
};

const globalFonts = new Map<string, string>();

export class Index extends Layer {
  private viewBoxWidth = 100;
  private viewBoxHeight = 100;
  private radius = 50;
  private svg: SVGSVGElement;

  constructor(params: IndexProps) {
    super();

    this.radius = params.radius || 50;

    this.svg = createSvg({
      viewBox: `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`,
    });

    const wrapper = document.querySelector(".wrapper") as HTMLDivElement;
    wrapper.appendChild(this.svg);

    (async () => {
      const step = 360 / params.count;
      for (let i = 0; i < params.count; i++) {
        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        group.setAttribute(
          "transform",
          `translate(${this.viewBoxWidth * 0.5}, ${
            this.viewBoxHeight * 0.5
          }) rotate(${i * step})`
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
    text.setAttribute("y", (-this.radius).toString());
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
    rect.setAttribute("y", this.radius.toString());

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
    circle.setAttribute("cy", this.radius.toString());

    return circle;
  }

  createTriangleElement(params?: TriangleShapeParams) {
    const triangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    const x1 = -(params?.width || 5) * 0.5;
    const y1 = this.radius;

    const x2 = (params?.width || 5) * 0.5;
    const y2 = this.radius;

    const x3 = 0;
    const y3 = this.radius - (params?.height || 5);

    triangle.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    triangle.setAttribute("fill", params?.fill || "white");

    return triangle;
  }
}
