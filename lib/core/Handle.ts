import { Assets, Sprite } from "pixi.js";
import { Layer } from "./Layer";
import { Color, getPixiTint } from "../utils";

/**
 * Configuration options for Handle component
 * @typedef {Object} HandleProps
 * @property {string} imageUrl - URL of the handle image to load
 * @property {string} [label] - Optional label for the handle
 * @property {number} [scale=1] - Optional scale factor for the handle sprite
 * @property {number} [offsetY=0] - Optional vertical offset from anchor point
 */
export type HandleProps = {
  imageUrl: string;
  label?: string;
  scale?: number;
  offsetY?: number;
  tint?: Color;
  fill?: Color;
};

/**
 * A Layer component that displays an image handle with configurable positioning
 * @extends Layer
 */
export class Handle extends Layer {
  /**
   * Creates a new Handle instance
   * @param {HandleProps} params - Configuration options for the handle
   */
  constructor(params: HandleProps) {
    super();
    if (params.label) {
      this.label = params.label;
    }

    Assets.add({
      alias: params.imageUrl,
      src: params.imageUrl,
      loadParser: "loadTextures",
    });

    Assets.load(params.imageUrl).then((texture) => {
      const loadMediaEvent = new CustomEvent("load-media", {
        detail: {
          url: params.imageUrl,
        },
      });

      document.dispatchEvent(loadMediaEvent);

      const sprite = new Sprite(texture);
      sprite.scale.set(params.scale || 1);
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 1 + (params.offsetY || 0);
      sprite.tint = getPixiTint(params.tint || params.fill);
      this.addChild(sprite);
    });
  }
}
