const fs = require("fs").promises;
const path = require("path");

async function concatenateFiles(directory, extension, outputPath) {
  const output = [];
  const baseDir = path.resolve(directory);

  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.name.endsWith(extension)) {
        const content = await fs.readFile(fullPath, "utf-8");
        const relativePath = path.relative(baseDir, fullPath);
        const cleanContent = content
          .replace(/\r?\n|\r/g, "")
          .replace(/\s+/g, " ");
        output.push(`//{{ ${relativePath} }}\n${cleanContent}`);
      }
    }
  }

  await scanDirectory(directory);
  const outputDir = path.dirname(outputPath);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, output.join("\n"));
}

concatenateFiles("./lib", "ts", "./.context/lib.txt").catch(console.error);
concatenateFiles("./examples", "html", "./.context/examples.txt").catch(
  console.error
);
