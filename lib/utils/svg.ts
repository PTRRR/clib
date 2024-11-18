export const createSvg = (params?: {
  width?: number;
  height?: number;
  viewBox?: string;
}) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  if (params?.width) {
    svg.setAttribute("width", params.width.toString());
  }

  if (params?.height) {
    svg.setAttribute("height", params.height.toString());
  }

  if (params?.viewBox) {
    svg.setAttribute("viewBox", params.viewBox);
  }

  return svg;
};
