import { Clock } from "../core";
import { loadData } from "./csv";

export const createClock = async (
  setup?: (clock: Clock, data: Record<string, number[]>) => void
) => {
  const html = document.documentElement;
  html.style.margin = "0";
  html.style.padding = "0";
  html.style.height = "100vh";

  const body = document.body;
  body.style.display = "flex";
  body.style.margin = "0";
  body.style.height = "100vh";
  body.style.width = "100%";
  body.style.alignItems = "center";
  body.style.justifyContent = "center";

  const container = document.createElement("div");
  container.style.height = "80%";
  container.style.width = "auto";
  container.style.aspectRatio = "1";

  body.appendChild(container);

  const clock = new Clock(container);
  await clock.initialize();

  try {
    const data = await loadData("./data.csv");
    setup?.(clock, data);
  } catch (error) {
    console.error(error);
    setup?.(clock, {});
  }
};
