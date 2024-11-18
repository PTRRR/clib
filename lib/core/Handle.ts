import { Assets, Sprite } from "pixi.js";
import { Layer } from "./Layer";

export type HandleProps = {
  imageUrl: string;
  scale?: number;
  offsetY?: number;
};

export class Handle extends Layer {
  constructor(params: HandleProps) {
    super();

    Assets.load(params.imageUrl).then((texture) => {
      const sprite = new Sprite(texture);
      sprite.scale.set(params.scale || 1);
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 1 + (params.offsetY || 0);
      this.addChild(sprite);
    });
  }
}
