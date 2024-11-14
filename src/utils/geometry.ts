import { Geometry, Point } from "pixi.js";

type Props = {
  radius?: number;
  segments?: number;
  center?: Point;
};

export const createRadialMeshGeometry = (props?: Props) => {
  const radius: number = props?.radius || 100;
  const segments: number = props?.segments || 20;
  const center: Point = props?.center || new Point(0, 0);

  const contour: Point[] = [];
  const step = (Math.PI * 2) / segments;

  for (let i = 0; i <= segments; i++) {
    const angle = step * i - Math.PI * 0.5;
    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;
    contour.push(new Point(x, y));
  }

  // Default attributes
  const position: number[] = [];
  const indexBuffer: number[] = [];

  for (let i = 0; i < segments; i++) {
    const vector = contour[i];
    const nextVector = contour[i + 1];

    // Indices
    indexBuffer.push(i * 3, i * 3 + 1, i * 3 + 2);

    // Positions
    position.push(0, 0);
    position.push(vector.x, vector.y);
    position.push(nextVector.x, nextVector.y);
  }

  const geometry = new Geometry({
    attributes: {
      position,
    },
    indexBuffer,
  });

  return geometry;
};
