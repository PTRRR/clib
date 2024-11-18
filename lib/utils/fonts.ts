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
