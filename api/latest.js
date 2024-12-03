// api/latest.js
import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
  const packageJson = JSON.parse(
    readFileSync(join(process.cwd(), "package.json"), "utf8")
  );

  res.redirect(
    307,
    `https://cdn.jsdelivr.net/gh/PTRRR/energy-clock-lib@v${packageJson.version}/dist/index.js`
  );
}
