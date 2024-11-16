/**
 * Import required dependencies for curve subdivision and resampling
 */
import { subdivide, SUBDIV_CHAIKIN } from "@thi.ng/geom-subdiv-curve";
import { Sampler, simplify } from "@thi.ng/geom-resample";
import { Path, Point, Values } from "../types";

export const mapValueToPolar = (
  value: number,
  index: number,
  length: number
): Point => {
  const step = (Math.PI * 2) / length;
  const angle = step * index - Math.PI * 0.5;
  const x = Math.cos(angle) * value;
  const y = Math.sin(angle) * value;
  return [x, y];
};

/**
 * Converts an array of values into polar coordinates path
 * @param {Values} [values=[]] - Array of numerical values to be converted
 * @returns {Path} Array of [x, y] coordinates representing the polar path
 * @description
 * Each value is mapped to a point on a circle where:
 * - The angle is determined by the index in the array (evenly distributed around 2π)
 * - The radius is determined by the value itself
 * - The path starts at -π/2 (top of the circle)
 */
export const mapValuesToPolarPath = (values: Values = []) => {
  const polarCoordinates: Path = [];
  for (let i = 0; i < values.length; i++) {
    const wrappedIndex = i < values.length ? i : 0;
    const value = values[wrappedIndex];
    const coord = mapValueToPolar(value, i, values.length);
    polarCoordinates.push(coord);
  }
  return polarCoordinates;
};

/**
 * Converts a polar coordinates path back to an array of radius values
 * @param {Path} [path=[]] - Array of [x, y] coordinates representing the polar path
 * @returns {Values} Array of radius values calculated from the coordinates
 * @description
 * Calculates the radius (distance from origin) for each point using the Pythagorean theorem
 */
export const mapPolarPathToValues = (path: Path = []): Values => {
  return path.map(([x, y]) => {
    const radius = Math.sqrt(x * x + y * y);
    return radius;
  });
};

/**
 * Applies Chaikin subdivision to a closed path
 * @param {Path} [path=[]] - The original path to subdivide
 * @param {number} [iterations=0] - Number of subdivision iterations to perform
 * @returns {Path} The subdivided path with smoother curves
 * @description
 * Uses Chaikin's corner cutting algorithm to create a smoother curve.
 * The resulting path will have more points than the original, with each
 * iteration increasing the point count.
 */
export const subdivideClosedPath = (
  path: Path = [],
  iterations: number = 0
) => {
  return subdivide(
    [...path],
    new Array(iterations).fill(SUBDIV_CHAIKIN),
    true
  ).map(([x, y]) => [x, y]) as Path;
};

/**
 * Resamples a closed path to have a specific number of evenly spaced points
 * @param {Path} [path=[]] - The original path to resample
 * @param {number} [samples=0] - The desired number of points in the resampled path
 * @returns {Path} The resampled path with the specified number of points
 * @description
 * Creates a new path with points evenly distributed along the original path's shape.
 * Useful for normalizing paths to have consistent point counts regardless of their
 * original sampling.
 */
export const resampleClosedPath = (path: Path = [], samples: number = 0.0) => {
  const sampler = new Sampler([...path], true);
  return sampler.sampleFixedNum(samples) as Path;
};

/**
 * Simplifies a closed path by reducing the number of points while preserving shape
 * @param {Path} [path=[]] - The original path to simplify
 * @param {number} [factor=0.0] - The simplification factor (higher values = more simplification)
 * @returns {Path} The simplified path with fewer points
 * @description
 * Reduces the number of points in the path while attempting to maintain its overall shape.
 * The factor parameter controls how aggressive the simplification is:
 * - Lower values preserve more detail but remove fewer points
 * - Higher values create simpler paths but may lose more detail
 */
export const simplifyClosedPath = (path: Path = [], factor: number = 0.0) => {
  return simplify([...path], factor, true) as Path;
};
