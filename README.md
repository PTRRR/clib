# Clock Visualization Library

A powerful TypeScript library for creating customizable, animated clock visualizations using PIXI.js.

<div align="center">
  <img src="example.png" width="400" alt="Example Clock Visualization">
</div>

## Workshop Origins

This framework was developed as a teaching tool for a graphic design workshop introducing students to computer graphics and data-driven design principles. It provides an approachable entry point to WebGL, shader programming, and generative design through the familiar metaphor of clock visualization. The library abstracts complex graphics programming concepts while still allowing students to experiment with advanced features as their understanding grows.

## Features

- SVG-based clock face and hand rendering
- Customizable radial charts and indices
- Support for various shapes (circles, rectangles, triangles, text)
- Custom shader support
- Texture mapping
- Smooth animations
- Blend mode support
- High-performance WebGL rendering

## Installation

```bash
npm install clock-visualization
```

## Basic Usage

```typescript
import { Clock } from 'clock-visualization';

// Create clock instance
const clock = new Clock(container);
await clock.initialize();

// Add clock hands
clock.addHandle({
  imageUrl: '/assets/hand.svg',
  label: 'hours'
});

// Add hour markers
clock.addCircles({
  count: 12,
  radius: 2,
  fill: 'white'
});

// Add animation
clock.addAnimation(defaultClockStep(clock));
```

## Advanced Features

- Custom shader support for advanced visual effects
- Radial charts for data visualization
- Custom shape handlers
- Noise-based value generation
- Font loading and rendering
- SVG conversion utilities



## License

MIT