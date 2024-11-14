/**
 * Import required dependencies
 */
import { Geometry } from "pixi.js";
import { mapValuesToPolarPath } from "./path";

/**
 * Creates a PIXI.js Geometry object representing a radial mesh from an array of values
 * @param {number[]} [values=[]] - Array of numerical values to create the radial mesh from
 * @returns {Geometry} A PIXI.js Geometry object configured for radial rendering
 * @description
 * Creates a triangular mesh geometry where:
 * - Each value generates a triangle connecting to the center point
 * - Triangles are arranged in a radial pattern
 * - The mesh forms a continuous surface suitable for radial visualization
 *
 * Geometry Structure:
 * - Each triangle consists of three vertices:
 *   1. Center point (0, 0)
 *   2. Current point from the polar path
 *   3. Next point from the polar path (wrapping to first point for the last triangle)
 *
 * Attributes Created:
 * - aPosition: Vertex positions as [x, y] pairs
 * - indexBuffer: Triangle indices for rendering
 *
 * @example
 * // Create a simple square geometry
 * const geometry = createRadialMeshGeometry([1, 1, 1, 1]);
 *
 * // Create a triangular geometry
 * const geometry = createRadialMeshGeometry([1, 1, 1]);
 */
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
    aPosition.push(0, 0); // Center vertex
    aPosition.push(vector[0], vector[1]); // Current point
    aPosition.push(nextVector[0], nextVector[1]); // Next point
  }

  const geometry = new Geometry({
    attributes: { aPosition },
    indexBuffer,
  });

  return geometry;
};
