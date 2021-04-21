import { Renderable } from "./renderable";
import { Renderer } from "./renderer";

export class Scene {
  private _renderables: Renderable[];

  constructor() {
    this._renderables = [];
  }

  addRenderable(renderable: Renderable): void {
    this._renderables.push(renderable);
  }

  addRenderables(renderables: Renderable[]): void {
    this._renderables.push(...renderables);
  }

  removeRenderable(renderable: Renderable): void {
    const index = this._renderables.indexOf(renderable);
    if (index === -1) {
      this._renderables.splice(index, 1);
    }
  }

  getRenderables(): Renderable[] {
    return this._renderables;
  }

  /** @internal */
  _release(): void {
    // TODO
  }

  /** @internal */
  _setup(renderer: Renderer): void {
    this._renderables.forEach(renderable => {
      renderable._setupBuffers(renderer);
    });
  }
}
