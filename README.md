# Radial Visualization Library

A powerful and flexible TypeScript library for creating animated radial visualizations using PIXI.js. Perfect for creating interactive dashboards, data visualizations, and animated circular displays.

## Features

- 🎨 Smooth radial visualizations with WebGL rendering
- 📊 Flexible data mapping and normalization
- 🔄 Path interpolation and subdivision
- ⚡ High-performance mesh-based rendering
- 📱 Resolution-independent rendering
- 🎛️ Customizable shaders and appearances

## Installation

```bash
npm install @your-org/radial-viz
# or
yarn add @your-org/radial-viz
```

## Quick Start

```typescript
import { Clock } from "@your-org/radial-viz";

// Create and initialize the visualization
const clock = new Clock();
await clock.initialize();

// Add a simple radial chart
const data = [0.5, 0.8, 0.3, 0.9, 0.6];
clock.addRadialChart(data, {
  samples: 100, // Number of interpolation points
  subdivisions: 2, // Smoothing iterations
});
```

## Core Components

### Clock

The main application class that manages the canvas and rendering context.

```typescript
const clock = new Clock();
await clock.initialize();
document.body.appendChild(clock.canvas);
```

### RadialChart

Creates circular visualizations from arrays of values.

```typescript
const chart = new RadialChart(values, {
  samples: 100,       // Optional: Number of interpolation points
  subdivisions: 2,    // Optional: Number of smoothing iterations
  vertexShader: '...' // Optional: Custom vertex shader
  fragmentShader: '...' // Optional: Custom fragment shader
});
```

## Utility Functions

### Path Manipulation

```typescript
import {
  mapValuesToPolarPath,
  subdivideClosedPath,
  resampleClosedPath,
  simplifyClosedPath,
} from "@your-org/radial-viz";

// Convert values to polar coordinates
const path = mapValuesToPolarPath([0.5, 0.8, 0.3]);

// Smooth the path
const smoothPath = subdivideClosedPath(path, 2);

// Resample to exact number of points
const resampledPath = resampleClosedPath(path, 100);

// Simplify path while maintaining shape
const simplifiedPath = simplifyClosedPath(path, 0.1);
```

### Value Processing

```typescript
import { normalizeValues, remapValues } from "@your-org/radial-viz";

// Normalize values to [0,1] range
const normalized = normalizeValues([10, 20, 30]);

// Remap values to new range
const remapped = remapValues([10, 20, 30], 0, 100);
```

### Mathematical Utilities

```typescript
import { clampValue, remapValue } from "@your-org/radial-viz";

// Clamp a value to a range
const clamped = clampValue(value, 0, 1);

// Remap a single value to new range
const remapped = remapValue(value, 0, 1, -10, 10);
```

## Advanced Usage

### Custom Shaders

You can provide custom vertex and fragment shaders for unique visual effects:

```typescript
const chart = new RadialChart(values, {
  vertexShader: `
    attribute vec2 aPosition;
    attribute float aValue;
    varying float vValue;
    
    void main() {
      vValue = aValue;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    varying float vValue;
    
    void main() {
      gl_FragColor = vec4(vValue, 0.0, 1.0, 1.0);
    }
  `,
});
```

### Path Processing Pipeline

For complex visualizations, you can chain multiple path processing operations:

```typescript
let path = mapValuesToPolarPath(values);
path = subdivideClosedPath(path, 2);
path = resampleClosedPath(path, 100);
path = simplifyClosedPath(path, 0.1);
```

## Performance Considerations

- Use `samples` and `subdivisions` judiciously - higher values create smoother results but impact performance
- The `simplifyClosedPath` function can help reduce geometry complexity while maintaining visual quality
- Consider using fewer points for real-time animations

## Browser Support

- Works in all modern browsers that support WebGL
- Automatically handles device pixel ratio for crisp rendering on high-DPI displays
- Falls back to standard resolution on devices without WebGL support

## License

MIT © [Your Organization]

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.
