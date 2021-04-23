import { Material } from "./material";
import { Renderable } from "./renderable";
import { Renderer } from "./renderer";

export class Scene {
  private _renderables: Renderable[];
  private _sharedMaterialRenderables: Map<Material, Renderable[]>;

  constructor() {
    this._renderables = [];
    this._sharedMaterialRenderables = new Map();
  }

  addRenderable(renderable: Renderable): void {
    this._renderables.push(renderable);
    const material = renderable.getMaterial();
    const sharedMaterialRenderables = this._sharedMaterialRenderables.get(material);
    if (sharedMaterialRenderables) {
      sharedMaterialRenderables.push(renderable);
    }
    else {
      this._sharedMaterialRenderables.set(material, [renderable]);
    }
  }

  addRenderables(renderables: Renderable[]): void {
    renderables.forEach((renderable) => {
      this.addRenderable(renderable);
    });
  }

  removeRenderable(renderable: Renderable): void {
    let index = this._renderables.indexOf(renderable);
    if (index > -1) {
      this._renderables.splice(index, 1);
    }
    const material = renderable.getMaterial();
    const sharedMaterialRenderables = this._sharedMaterialRenderables.get(material);
    if (sharedMaterialRenderables) {
      index = sharedMaterialRenderables.indexOf(renderable);
      if (index > -1) {
        sharedMaterialRenderables.splice(index, 1);
      }
      if (sharedMaterialRenderables.length === 0) {
        this._sharedMaterialRenderables.delete(material);
      }
    }
  }

  getRenderables(): Renderable[] {
    return this._renderables;
  }

  getSharedMaterialRenderables(): [Material, Renderable[]][] {
    return Array.from(this._sharedMaterialRenderables.entries());
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
