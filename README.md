# Clock Visualization Library

A TypeScript library for creating customizable, animated clock visualizations using PIXI.js.

<div align="center">
  <img src="example.png" width="400" alt="Example Clock Visualization">
</div>

## Workshop Origins

This framework was developed as a teaching tool for a graphic design workshop introducing students to computer graphics and data-driven design principles. It provides an approachable entry point to WebGL, shader programming, and generative design through the familiar metaphor of clock visualization. The library abstracts complex graphics programming concepts while still allowing students to experiment with advanced features as their understanding grows.

## Getting Started

### Prerequisites

1. Install Visual Studio Code
   - Download VS Code from [code.visualstudio.com](https://code.visualstudio.com)
   - Follow the installation instructions for your operating system

### Quick Start with Examples

1. Browse the examples at [https://ptrrr.github.io/clib/examples](https://ptrrr.github.io/clib/examples)
2. Find an example you like and click its "code" link to view the source code on GitHub
3. Open the example in VS Code:

   - Copy the code from GitHub
   - Create a new file in VS Code (e.g., `clock-example.html`)
   - Paste the code and save
   - Double-click the file to open in your browser

4. Start experimenting!

   - Modify the code to see instant changes
   - Try changing colors, sizes, or adding new elements

5. Try Autopilot Mode

   - Create a new HTML file with this basic structure:

     ```html
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta
           name="viewport"
           content="width=device-width, initial-scale=1.0"
         />
         <title>Document</title>
         <script src="https://autopilot.vpr-group.ch/api/clib"></script>
       </head>
       <body>
         <script type="module" autopilot>
           // 1. Create clock with the imported helper function
           // 2. Add six radial charts with different shades of pink and with noise value remapped from half of the clock radius and to the clock radius - 40.
           // 3. Create a stacking effect by reducing the remap values for each chart in order for them to become smaller and smaller
           // 4. Each step should be of size clock radius - (clock radius / six * step index)
           // 5. Each one of the chart should be unique but use the same noise values (but remapped as explained in step 3 to create a stacking effect)

           clock.addTexts({
             count: 24, // Label for each hour/position
             fontSize: 40, // Size of text
             offset: 20, // Distance from edge
           });

           // 6. For each number add a corresponding long rectangle beneath it. the rectangles and the numbers should not overlapp
         </script>
       </body>
     </html>
     ```

   - The autopilot will:
     - Complete partial code snippets
     - Generate code for natural language instructions
     - Combine and connect different components
     - Fix syntax errors automatically
     - Add necessary imports and configurations
   - You can gradually replace autopilot-generated code with your own as you learn

## Examples

[Browse Examples](https://ptrrr.github.io/clib/examples)

## Workshop Archives

[Browse Archives](https://autopilot.vpr-group.ch/api/clib/archives)

## Features

- SVG-based clock face and hand rendering
- Customizable radial charts and indices
- Support for various shapes (circles, rectangles, triangles, text)
- Custom shader support
- Texture mapping
- Smooth animations
- Blend mode support
- High-performance WebGL rendering

## Basic Usage

```typescript
// Create clock instance
const clock = new Clock(container);
await clock.initialize();

// Add clock hands
clock.addHandle({
  imageUrl: "/assets/hand.svg",
  label: "hours",
});

// Add hour markers
clock.addCircles({
  count: 12,
  radius: 2,
  fill: "white",
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

## Documentation

### Clock Instance Methods

#### addRadialChart(values, options?)

Creates a radial chart visualization.

- `values`: `number[]` - Array of values to plot
- `options`: Optional configuration object
  - `subdivisions`: `number` (0-10) - Path subdivision count for smoothness
  - `samples`: `number` (3-5000) - Sample count for path resampling
  - `centerOffset`: `number` - Distance from center point
  - `relativeOffset`: `boolean` - Whether centerOffset follows outer contour
  - `blendMode`: `string` - PIXI blend mode for compositing
  - `texture`: `string` - Texture image URL
  - `tint`: `{r: number, g: number, b: number, a: number}` - Color tint
  - `label`: `string` - Chart identifier

#### addHandle(options)

Adds a clock hand.

- `options`: Configuration object
  - `imageUrl`: `string` - URL for hand image
  - `scale`: `number` - Size scaling factor
  - `offsetY`: `number` - Vertical position offset
  - `label`: `string` - Handle identifier

#### addRectangles(options)

Adds rectangular markers around the clock.

- `options`: Configuration object
  - `count`: `number` - Number of rectangles
  - `width`: `number` - Rectangle width
  - `height`: `number` - Rectangle height
  - `offset`: `number` - Distance from edge
  - `fill`: `string` - Fill color

#### addCircles(options)

Adds circular markers around the clock.

- `options`: Configuration object
  - `count`: `number` - Number of circles
  - `radius`: `number` - Circle radius
  - `offset`: `number` - Distance from edge
  - `fill`: `string` - Fill color

#### addTriangles(options)

Adds triangular markers around the clock.

- `options`: Configuration object
  - `count`: `number` - Number of triangles
  - `width`: `number` - Triangle base width
  - `height`: `number` - Triangle height
  - `offset`: `number` - Distance from edge
  - `fill`: `string` - Fill color

#### addTexts(options)

Adds text labels around the clock.

- `options`: Configuration object
  - `count`: `number` - Number of labels
  - `fontSize`: `number` - Text size in pixels
  - `offset`: `number` - Distance from edge
  - `fill`: `string` - Text color

#### addCustomShape(options)

Adds custom shapes using a handler function.

- `options`: Configuration object
  - `count`: `number` - Number of shapes
  - `handler`: `(index: number, instance: ClockIndex) => Promise<Node>` - Shape generator
  - `offset`: `number` - Distance from edge
  - `label`: `string` - Shape identifier

#### addPlainCircle(options)

Adds a basic circle to the clock.

- `options`: Configuration object
  - `radius`: `number` - Circle radius
  - `segments`: `number` - Number of segments
  - `tint`: `{r: number, g: number, b: number, a: number}` - Color tint

#### addAnimation(step)

Adds an animation sequence.

- `step`: Animation configuration object
  - `duration`: `number` - Animation duration in milliseconds
  - `handler`: `(progress: number, delta: number) => void` - Animation function

## Utility Functions

### Data Processing

#### aggregateTimeSeries(values, config)

Aggregates time series data.

- `values`: `number[]` - Input values
- `config`: Configuration object
  - `period`: `"day" | "week" | "month" | "year"` - Aggregation period
  - `aggregationType`: `"sum" | "average" | "max" | "min"` - Calculation method
  - `startDate`: `Date` - Optional start date

#### scaleTimeSeries(arrays, min?, max?)

Scales multiple time series to a common range.

- `arrays`: `number[][]` - Arrays of values to scale
- `min`: `number` - Target minimum value
- `max`: `number` - Target maximum value

#### addTimeSeries(arrays)

Combines multiple time series by addition.

- `arrays`: `number[][]` - Arrays to combine

### Visual Effects

#### defaultClockStep(clock)

Creates default clock hand animation.

- `clock`: `Clock` - Clock instance to animate

#### logTransform(value, base?)

Applies logarithmic transformation to values.

- `value`: `number` - Input value
- `base`: `number` - Logarithm base (default: Math.E)

## License

⚠️ **EDUCATIONAL USE ONLY - RESTRICTED LICENSE** ⚠️

This software is licensed for educational purposes only and is restricted to students currently enrolled in the Graphic Rodeo Workshop at Fachklasse Grafik Luzern.

### Permitted Uses

- Educational use within the program
- Installation on personal devices for coursework
- Creation of backup copies for personal educational use

### Restrictions

- ❌ No commercial use
- ❌ No transfer to non-program students
- ❌ No reverse engineering or modification
- ❌ No use after program completion/withdrawal

### Eligibility

- Must be an actively enrolled student in the Graphic Rodeo Workshop
- Must provide valid student identification upon request
- License automatically terminates upon program completion or withdrawal

### Legal Notice

This software is provided "AS IS" without warranty of any kind. For full license terms, see [LICENSE](./LICENSE)

---

_By using this software, you agree to the terms outlined above._
