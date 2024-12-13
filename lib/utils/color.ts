/*
 * Graphic Rodeo Workshop - Educational License
 * Fachklasse Grafik Luzern
 * For educational use only - See LICENSE for terms
 */

import hexRgb from "hex-rgb";
import { Tint } from "../types";
import cssColors from "css-color-names";
import rgb2hex from "rgb2hex";

const HEX_COLOR_REGEX =
  /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
const RGB_COLOR_REGEX =
  /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const RGBA_COLOR_REGEX =
  /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-1](?:\.\d+)?|\.\d+)\s*\)$/;

/**
 * Represents a color in RGBA format with numeric values
 * @interface RGBAColor
 * @property {number} r - Red component (0-255)
 * @property {number} g - Green component (0-255)
 * @property {number} b - Blue component (0-255)
 * @property {number} a - Alpha component (0-1)
 */
export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Union type representing either an RGBAColor object or a string color value
 * @typedef {(RGBAColor | string)} Color
 */
export type Color = RGBAColor | string;

/**
 * Converts RGBA tint values to normalized vector format (0-1 range)
 * @param {Tint} [tint] - RGBA color values (0-255 range)
 * @returns {number[]} Array of normalized RGBA values, each in range [0,1]
 * @example
 * convertTintToNormalizedVector({ r: 255, g: 128, b: 0, a: 1 })
 * // Returns [1, 0.5, 0, 1]
 */
export const convertTintToNormalizedVector = (tint?: Tint) => {
  const { r, g, b, a } = tint || {};
  return [
    typeof r === "number" ? r / 255 : 1,
    typeof g === "number" ? g / 255 : 1,
    typeof b === "number" ? b / 255 : 1,
    typeof a === "number" ? a / 1 : 1,
  ];
};

/**
 * Checks if a string is a valid hexadecimal color
 * @param {string} color - String to test
 * @returns {boolean} True if string is a valid hex color
 * @example
 * isHexColor('#ff0000') // Returns true
 * isHexColor('ff0000')  // Returns false (missing #)
 * isHexColor('#xyz')    // Returns false (invalid chars)
 */
export const isHexColor = (color: string): boolean => {
  if (typeof color !== "string") return false;
  return HEX_COLOR_REGEX.test(color);
};

/**
 * Checks if a string is a valid RGB or RGBA color
 * @param {string} color - String to test
 * @returns {boolean} True if string is a valid RGB/RGBA color
 * @example
 * isRgbColor('rgb(255, 0, 0)')      // Returns true
 * isRgbColor('rgba(255, 0, 0, 0.5)') // Returns true
 * isRgbColor('rgb(300, 0, 0)')      // Returns true (validation happens during parsing)
 */
export const isRgbColor = (color: string): boolean => {
  if (typeof color !== "string") return false;
  return RGB_COLOR_REGEX.test(color) || RGBA_COLOR_REGEX.test(color);
};

/**
 * Parses an RGB or RGBA color string into an RGBAColor object
 * @private
 * @param {string} color - RGB/RGBA color string
 * @returns {RGBAColor | null} Parsed color object or null if invalid
 */
const parseRgbColor = (color: string): RGBAColor | null => {
  const rgbMatch = color.match(RGB_COLOR_REGEX);
  if (rgbMatch) {
    const [_, r, g, b] = rgbMatch;
    return {
      r: Math.min(255, Math.max(0, parseInt(r, 10))),
      g: Math.min(255, Math.max(0, parseInt(g, 10))),
      b: Math.min(255, Math.max(0, parseInt(b, 10))),
      a: 1,
    };
  }

  const rgbaMatch = color.match(RGBA_COLOR_REGEX);
  if (rgbaMatch) {
    const [_, r, g, b, a] = rgbaMatch;
    return {
      r: Math.min(255, Math.max(0, parseInt(r, 10))),
      g: Math.min(255, Math.max(0, parseInt(g, 10))),
      b: Math.min(255, Math.max(0, parseInt(b, 10))),
      a: Math.min(1, Math.max(0, parseFloat(a))),
    };
  }

  return null;
};

/**
 * Normalizes any supported color format to an RGBAColor object
 * @param {Color} [color] - Color in any supported format
 * @returns {RGBAColor} Normalized RGBA color object
 * @example
 * normalizeColorToRgba('#ff0000')
 * // Returns { r: 255, g: 0, b: 0, a: 1 }
 *
 * normalizeColorToRgba('rgb(255, 0, 0)')
 * // Returns { r: 255, g: 0, b: 0, a: 1 }
 *
 * normalizeColorToRgba('red')
 * // Returns { r: 255, g: 0, b: 0, a: 1 }
 *
 * normalizeColorToRgba({ r: 255, g: 0, b: 0, a: 0.5 })
 * // Returns { r: 255, g: 0, b: 0, a: 0.5 }
 */
export const normalizeColorToRgba = (color: Color = "white"): RGBAColor => {
  if (typeof color === "string") {
    // Handle hex colors
    if (isHexColor(color)) {
      const value = hexRgb(color);
      return {
        r: value.red,
        g: value.green,
        b: value.blue,
        a: value.alpha,
      };
    }
    // Handle RGB/RGBA colors
    else if (isRgbColor(color)) {
      const rgbColor = parseRgbColor(color);
      if (rgbColor) {
        return rgbColor;
      }
    }
    // Handle named colors
    else {
      const hexColor = cssColors[color.toLowerCase()];
      if (typeof hexColor === "string") {
        const value = hexRgb(hexColor);
        return {
          r: value.red,
          g: value.green,
          b: value.blue,
          a: value.alpha,
        };
      }
    }

    // Return black transparent if invalid color
    return {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    };
  }
  // Handle object input
  else {
    return {
      r: Math.min(255, Math.max(0, color.r || 0)),
      g: Math.min(255, Math.max(0, color.g || 0)),
      b: Math.min(255, Math.max(0, color.b || 0)),
      a: Math.min(1, Math.max(0, color.a ?? 1)), // Default alpha to 1 if not provided
    };
  }
};

/**
 * Converts any supported color format to a hexadecimal color string
 * @param {Color} [color] - Color in any supported format
 * @returns {string} Hexadecimal color string (e.g., '#ff0000')
 * @example
 * getHexColor('rgb(255, 0, 0)') // Returns '#ff0000'
 * getHexColor({ r: 255, g: 0, b: 0 }) // Returns '#ff0000'
 * getHexColor('red') // Returns '#ff0000'
 */
export const getHexColor = (color?: Color) => {
  const { r, g, b, a } = normalizeColorToRgba(color);
  const { hex } = rgb2hex(`rgb(${r},${g},${b},${a})`);
  return hex;
};

/**
 * Converts any supported color format to a PixiJS-compatible tint number
 * @param {Color} [color] - Color in any supported format (hex, rgb, rgba, named color, or RGBAColor object)
 * @returns {number} PixiJS compatible tint (e.g., 0xff0000 for red)
 * @example
 * getPixiTint('#ff0000') // Returns 0xff0000
 * getPixiTint('rgb(255, 0, 0)') // Returns 0xff0000
 * getPixiTint({ r: 255, g: 0, b: 0 }) // Returns 0xff0000
 * getPixiTint('red') // Returns 0xff0000
 * getPixiTint() // Returns 0xffffff (white)
 */
export const getPixiTint = (color?: Color): number => {
  // If no color provided, return white (no tint)
  if (!color) {
    return 0xffffff;
  }

  // Get normalized RGBA values
  const { r, g, b } = normalizeColorToRgba(color);

  // Convert RGB to hex number without alpha
  // Shift bits to create format 0xRRGGBB
  return (r << 16) + (g << 8) + b;
};
