import { createSvg } from "../utils/svg";
import { Layer } from "./Layer";

export type TextShapeParams = {
  text?: string;
  fontFamiy: string;
  fontSize: number;
  fill: string;
};

export type RectShapeParams = {
  width: number;
  height: number;
  fill: string;
};

export type CircleShapeParams = {
  radius: number;
  fill: string;
};

export type TriangleShapeParams = {
  width: number;
  height: number;
  fill: string;
};

export type ShapeParams =
  | {
      type: "circle";
      params: CircleShapeParams;
    }
  | {
      type: "triangle";
      params: TriangleShapeParams;
    }
  | {
      type: "rect";
      params: RectShapeParams;
    }
  | {
      type: "text";
      params: TextShapeParams;
    };

export type IndexProps = {
  count: number;
  radius?: number;
  shape:
    | ShapeParams
    | {
        type: "custom";
        handler: (index: number, instance: Index) => Node | undefined;
      };
};

export class Index extends Layer {
  private viewBoxWidth = 100;
  private viewBoxHeight = 100;
  private radius = 50;

  constructor(params: IndexProps) {
    super();

    this.radius = params.radius || 50;

    const svg = createSvg({
      viewBox: `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`,
    });

    const wrapper = document.querySelector(".wrapper") as HTMLDivElement;
    wrapper.appendChild(svg);

    const step = 360 / params.count;
    for (let i = 0; i < params.count; i++) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute(
        "transform",
        `translate(${this.viewBoxWidth * 0.5}, ${
          this.viewBoxHeight * 0.5
        }) rotate(${i * step})`
      );

      svg.appendChild(group);

      const shape =
        params.shape.type === "custom"
          ? params.shape.handler(i, this)
          : this.createShape({ ...params.shape, index: i });

      if (shape) {
        group.appendChild(shape);
      }
    }
  }

  private createShape({
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
            ...params,
            text: params.text || index.toString(),
          })
        : this.createTriangleElement(params);

    return shape;
  }

  createTextElement(params: TextShapeParams) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text.setAttribute("font-family", params.fontFamiy);
    text.setAttribute("font-size", params.fontSize.toString());
    text.setAttribute("fill", params.fill);
    text.setAttribute("x", "0");
    text.setAttribute("y", (-this.radius).toString());
    text.setAttribute("transform", "rotate(180deg, 0, 0)");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = params.text || "";

    return text;
  }

  createRectElement(params: RectShapeParams) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("width", params.width.toString());
    rect.setAttribute("height", params.height.toString());
    rect.setAttribute("fill", params.fill);
    rect.setAttribute("x", (params.width * -0.5).toString());
    rect.setAttribute("y", (this.radius - params.height).toString());

    return rect;
  }

  createCircleElement(params: CircleShapeParams) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("r", params.radius.toString());
    circle.setAttribute("fill", params.fill);
    circle.setAttribute("cx", "0");
    circle.setAttribute("cy", this.radius.toString());

    return circle;
  }

  createTriangleElement(params: TriangleShapeParams) {
    const triangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    const x1 = -params.width * 0.5;
    const y1 = this.radius;

    const x2 = params.width * 0.5;
    const y2 = this.radius;

    const x3 = 0;
    const y3 = this.radius - params.height;

    triangle.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    triangle.setAttribute("fill", params.fill);

    return triangle;
  }
}
