import { Geometry } from "pixi.js";
import { mapValuesToPolarPath } from "./path";

export const createRadialMeshGeometry = (values: number[] = []) => {
  const contour = mapValuesToPolarPath(values);

  // Default attributes
  const aPosition: number[] = [];
  const indexBuffer: number[] = [];

  for (let i = 0; i < contour.length; i++) {
    const vector = contour[i];
    const nextIndex = i + 1 < contour.length ? i + 1 : 0;
    const nextVector = contour[nextIndex];

    // Indices
    indexBuffer.push(i * 3, i * 3 + 1, i * 3 + 2);

    // Positions
    aPosition.push(0, 0);
    aPosition.push(vector[0], vector[1]);
    aPosition.push(nextVector[0], nextVector[1]);
  }

  const geometry = new Geometry({
    attributes: { aPosition },
    indexBuffer,
  });

  return geometry;
};
