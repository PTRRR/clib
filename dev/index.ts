// Import clock creation function
import { createClock } from "../lib";

createClock((clock) => {
  const clockRadius = clock.width / 2;

  clock.addPlainCircle({
    radius: clockRadius,
    label: "rect",
    tint: {
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    },
  });

  clock.addTriangles({
    count: 24, // One triangle per hour
    width: 50, // Width of triangles
    height: 400, // Height of triangles
    fill: "red",
  });

  clock.addTriangles({
    count: 24, // One triangle per hour
    width: 43, // Width of triangles
    height: 400, // Height of triangles
    label: "triang",
    offset: 50,
    fill: "darkRed",
  });

  clock.addTriangles({
    count: 24, // One triangle per hour
    width: 35, // Width of triangles
    height: 400, // Height of triangles
    fill: "red",
    label: "triang2",
    offset: 100,
  });

  clock.addTriangles({
    count: 24, // One triangle per hour
    width: 29, // Width of triangles
    height: 400, // Height of triangles
    label: "triang",
    offset: 150,
    fill: "darkRed",
  });

  clock.addTriangles({
    count: 24, // One triangle per hour
    width: 23, // Width of triangles
    height: 300, // Height of triangles
    fill: "red",
    label: "triang2",
    offset: 200,
  });

  clock.addTriangles({
    count: 24, // One triangle per hour
    width: 14, // Width of triangles
    height: 230, // Height of triangles
    label: "triang3",
    offset: 250,
    fill: "darkRed",
  });

  clock.addTexts({
    count: 24, // Label for each hour/position
    fontSize: 23, // Size of text
    offset: 12, // Distance from edge
    fill: "red",
    label: "text",
  });

  clock.addHandle({
    imageUrl: "http://localhost:3000/api/clib/file/f444288uvwhpsqkoq5b2rv8q",
    scale: 0.1,
    offsetY: -0.166,
    label: "seconds",
  });
  clock.addHandle({
    imageUrl: "http://localhost:3000/api/clib/file/l5oyp4dritgsun7t74pyy7an",
    scale: 0.1,
    offsetY: -0.166,
    label: "minutes",
  });
  clock.addHandle({
    imageUrl: "http://localhost:3000/api/clib/file/utzlcudbn6gy9iz2kirkg7uk",
    scale: 0.1,
    offsetY: -0.23,
    label: "hours",
    fill: "black",
  });

  const triangLayer = clock.getLayerByLabel("triang");
  triangLayer.rotation = 0.208 * Math.PI;

  const triang2Layer = clock.getLayerByLabel("triang2");
  triang2Layer.rotation = 0.208 * Math.PI;

  const triang3Layer = clock.getLayerByLabel("triang3");
  triang3Layer.rotation = 0.208 * Math.PI;

  const textLayer = clock.getLayerByLabel("text");
  textLayer.rotation = -0.04 * Math.PI;
});
