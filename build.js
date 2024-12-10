// build.js
const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: [path.resolve(__dirname, "lib/index.ts")],
    outdir: "dist",
    bundle: true,
    format: "esm",
    platform: "neutral",
    outExtension: { ".js": ".js" },
    minify: false,
    sourcemap: false,
    target: ["es2020"],
    outbase: "lib",
    loader: {
      ".ts": "ts",
      ".js": "js",
    },
    external: ["stream"],
    platform: "neutral",
    resolveExtensions: [".ts", ".js", ".json"],
    mainFields: ["module", "main"],
    tsconfig: path.resolve(__dirname, "./tsconfig.json"),
  })
  .catch(() => process.exit(1));
