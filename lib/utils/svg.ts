/*
 * Graphic Rodeo Workshop - Educational License
 * Fachklasse Grafik Luzern
 * For educational use only - See LICENSE for terms
 */

type SvgParams = {
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** ViewBox specification string */
  viewBox?: string;
};

/**
 * Creates an SVG element with specified dimensions and viewBox
 * @param {SvgParams} [params] - Optional SVG parameters
 * @returns {SVGSVGElement} The created SVG element
 */
export const createSvg = (params?: SvgParams) => {
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

/**
 * Converts an SVG element to a base64 data URL
 * @param {SVGSVGElement} svg - SVG element to convert
 * @returns {string} Base64 encoded data URL
 */
export const getSvgAsImageUrl = (svg: SVGSVGElement) => {
  const xml = new XMLSerializer().serializeToString(svg);
  const svg64 = btoa(xml);
  const b64Start = "data:image/svg+xml;base64,";
  return b64Start + svg64;
};

/**
 * Creates an Image element from an SVG element
 * @param {SVGSVGElement} svg - SVG element to convert
 * @returns {HTMLImageElement} The created image element
 */
export const getSvgAsImage = (svg: SVGSVGElement) => {
  const url = getSvgAsImageUrl(svg);
  const img = new Image();
  img.src = url;
  return img;
};
