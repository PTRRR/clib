/*
 * Graphic Rodeo Workshop - Educational License
 * Fachklasse Grafik Luzern
 * For educational use only - See LICENSE for terms
 */

/**
 * Converts a font file to a data URL
 * @param {string} path - URL path to the font file
 * @returns {Promise<string>} Data URL representation of the font
 * @throws {Error} If font loading or conversion fails
 */
export const getFontDataUrl = (path: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await fetch(path);
      const blob = await resp.blob();
      const f = new FileReader();
      f.addEventListener("load", () => resolve(f.result as string));
      f.addEventListener("error", (error) => reject(error));
      f.readAsDataURL(blob);
    } catch (error) {
      reject(error);
    }
  });
};
