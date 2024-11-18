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

export const getSvgAsImageUrl = (svg: SVGSVGElement) => {
  const xml = new XMLSerializer().serializeToString(svg);
  const svg64 = btoa(xml);
  const b64Start = "data:image/svg+xml;base64,";
  return b64Start + svg64;
};

export const getSvgAsImage = (svg: SVGSVGElement) => {
  const url = getSvgAsImageUrl(svg);
  const img = new Image();
  img.src = url;
  return img;
};
