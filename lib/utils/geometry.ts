/*
 * Graphic Rodeo Workshop - Educational License
 * Fachklasse Grafik Luzern
 * For educational use only - See LICENSE for terms
 */

/**
 * Import required dependencies
 */
import { Geometry } from "pixi.js";
import { mapValuesToPolarPath } from "./path";
import { Values } from "../types";

/**
 * Creates a PIXI.js Geometry object representing a radial mesh from two arrays of values
 * @param {number[]} [outerValues=[]] - Array of numerical values to create the outer contour
 * @param {number[]} [innerValues=[]] - Array of numerical values to create the inner contour
 * @returns {Geometry} A PIXI.js Geometry object configured for radial rendering
 * @description
 * Creates a quad mesh geometry between two contours where:
 * - Values generate vertices along inner and outer polar paths
 * - Quads connect corresponding points between contours
 * - The mesh forms a continuous surface suitable for radial visualization
 *
 * Geometry Structure:
 * - Each quad consists of four vertices connecting inner and outer contours:
 * 1. Current inner point
 * 2. Current outer point
 * 3. Next outer point
 * 4. Next inner point (wrapping to first points for the last quad)
 *
 * Attributes Created:
 * - aPosition: Vertex positions as [x, y] pairs
 * - indexBuffer: Triangle indices for rendering (two triangles per quad)
 *
 * @example
 * // Create a ring geometry with different inner and outer radii
 * const geometry = createRadialMeshGeometry([1, 1, 1, 1], [0.5, 0.5, 0.5, 0.5]);
 *
 * // Create a triangular ring
 * const geometry = createRadialMeshGeometry([1, 1, 1], [0.5, 0.5, 0.5]);
 */
export const createRingGeometry = (
  outerValues: Values = [],
  innerValues: Values = []
) => {
  const contour = mapValuesToPolarPath(outerValues);
  const innerContour = mapValuesToPolarPath(innerValues);

  if (contour.length !== innerContour.length) {
    throw new Error(
      "The number of values in the outer and inner contours must be equal"
    );
  }

  // Default attributes
  const aPosition: number[] = [];
  const indexBuffer: number[] = [];

  for (let i = 0; i < contour.length; i++) {
    const nextIndex = i + 1 < contour.length ? i + 1 : 0;

    const point = contour[i];
    const nextPoint = contour[nextIndex];

    const innerPoint = innerContour[i];
    const nextInnerPoint = innerContour[nextIndex];

    aPosition.push(innerPoint[0], innerPoint[1]);
    aPosition.push(point[0], point[1]);
    aPosition.push(nextPoint[0], nextPoint[1]);
    aPosition.push(nextInnerPoint[0], nextInnerPoint[1]);

    const startIndex = i * 4;

    indexBuffer.push(
      startIndex,
      startIndex + 1,
      startIndex + 2,
      startIndex,
      startIndex + 2,
      startIndex + 3
    );
  }

  const geometry = new Geometry({
    attributes: { aPosition },
    indexBuffer,
  });

  return geometry;
};
