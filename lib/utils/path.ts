import { subdivide, SUBDIV_CHAIKIN } from "@thi.ng/geom-subdiv-curve";
import { Sampler, simplify } from "@thi.ng/geom-resample";
import { Path, Values } from "../types";

export const mapValuesToPolarPath = (values: Values = []) => {
  const polarCoordinates: Path = [];
  const step = (Math.PI * 2) / values.length;

  for (let i = 0; i < values.length; i++) {
    const angle = step * i - Math.PI * 0.5;
    const wrappedIndex = i < values.length ? i : 0;
    const value = values[wrappedIndex];
    const x = Math.cos(angle) * value;
    const y = Math.sin(angle) * value;
    polarCoordinates.push([x, y]);
  }

  return polarCoordinates;
};

export const mapPolarPathToValues = (path: Path = []): Values => {
  return path.map(([x, y]) => {
    const radius = Math.sqrt(x * x + y * y);
    return radius;
  });
};

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

export const resampleClosedPath = (path: Path = [], samples: number = 0.0) => {
  const sampler = new Sampler([...path], true);
  return sampler.sampleFixedNum(samples) as Path;
};

export const simplifyClosedPath = (path: Path = [], factor: number = 0.0) => {
  return simplify([...path], factor, true) as Path;
};
