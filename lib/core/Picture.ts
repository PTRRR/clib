/*
 * Graphic Rodeo Workshop - Educational License
 * Fachklasse Grafik Luzern
 * For educational use only - See LICENSE for terms
 */

import { Assets, Sprite } from "pixi.js";
import { Layer } from "./Layer";
import { Color, getPixiTint } from "../utils";

/**
 * Type definition for Picture component properties
 */
export type PictureProps = {
  /** URL of the image to be loaded */
  imageUrl: string;
  /** Optional label for the picture */
  label?: string;
  /** Optional color tint to apply to the picture */
  tint?: Color;
  /** Optional fill color for the picture */
  fill?: Color;
  /** Optional scale factor for the picture */
  scale?: number;
};

/**
 * Picture class that extends Layer to handle image loading and display
 * @extends Layer
 */
export class Picture extends Layer {
  /**
   * Creates a new Picture instance
   * @param {PictureProps & { clockWidth: number }} params - Configuration parameters
   * @param {string} params.imageUrl - URL of the image to load
   * @param {string} [params.label] - Optional label for the picture
   * @param {Color} [params.tint] - Optional color tint to apply
   * @param {Color} [params.fill] - Optional fill color
   * @param {number} [params.scale] - Optional scale factor
   * @param {number} params.clockWidth - Width of the clock container
   */
  constructor(params: PictureProps & { clockWidth: number }) {
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

      const { width } = texture.frame as {
        width: number;
      };

      const scale =
        typeof params.scale === "number"
          ? params.scale
          : params.clockWidth / width;

      const sprite = new Sprite(texture);
      sprite.scale.set(scale || 1);
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      sprite.tint = getPixiTint(params.tint || params.fill);
      this.addChild(sprite);
    });
  }
}
