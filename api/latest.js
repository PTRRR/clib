// api/latest.js
import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
  res.setHeader("Expires", new Date(Date.now() + 3600000).toUTCString());

  const packageJson = JSON.parse(
    readFileSync(join(process.cwd(), "package.json"), "utf8")
  );

  res.redirect(
    307,
    `https://cdn.jsdelivr.net/gh/PTRRR/energy-clock-lib@v${packageJson.version}/dist/index.js`
  );
}
