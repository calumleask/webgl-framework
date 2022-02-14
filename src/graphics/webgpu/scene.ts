import { Material } from './material';
import { MaterialImplementation } from './materialImplementation';
import { Mesh } from './mesh';
import { Renderable } from './renderable';
import { Renderer } from './renderer';

type MeshRenderableMap = Map<Mesh, Renderable[]>;
type MaterialImplementationMeshRenderablesMapPair = {
  meshRenderableMap: MeshRenderableMap;
  materialImplementation: MaterialImplementation;
};
type MaterialMeshRenderablesMap = Map<
  Material,
  MaterialImplementationMeshRenderablesMapPair
>;

export class Scene {
  private _renderables: Renderable[];
  private _sharedMaterialMeshRenderablesMap: MaterialMeshRenderablesMap;

  constructor() {
    this._renderables = [];
    this._sharedMaterialMeshRenderablesMap = new Map();
  }

  /** @internal */
  private static _addRenderablesToMeshRenderableMap(
    renderable: Renderable,
    meshRenderableMap: MeshRenderableMap,
  ): void {
    const mesh = renderable.getMesh();
    const renderables = meshRenderableMap.get(mesh);
    if (renderables) {
      renderables.push(renderable);
    } else {
      meshRenderableMap.set(mesh, [renderable]);
    }
  }

  /** @internal */
  private static _removeRenderablesFromMeshRenderableMap(
    renderable: Renderable,
    meshRenderableMap: MeshRenderableMap,
  ): void {
    const mesh = renderable.getMesh();
    const renderables = meshRenderableMap.get(mesh);
    if (renderables) {
      const index = renderables.indexOf(renderable);
      if (index > -1) {
        renderables.splice(index, 1);
      }
      if (renderables.length === 0) {
        meshRenderableMap.delete(mesh);
      }
    }
  }

  addRenderable(renderable: Renderable): void {
    this._renderables.push(renderable);
    const materialImplementation = renderable.getMaterial();
    const value = this._sharedMaterialMeshRenderablesMap.get(
      materialImplementation._getMaterial(),
    );
    if (value) {
      Scene._addRenderablesToMeshRenderableMap(
        renderable,
        value.meshRenderableMap,
      );
    } else {
      const meshRenderableMap: MeshRenderableMap = new Map();
      Scene._addRenderablesToMeshRenderableMap(renderable, meshRenderableMap);
      this._sharedMaterialMeshRenderablesMap.set(
        materialImplementation._getMaterial(),
        {
          materialImplementation,
          meshRenderableMap,
        },
      );
    }
  }

  addRenderables(renderables: Renderable[]): void {
    renderables.forEach((renderable) => {
      this.addRenderable(renderable);
    });
  }

  removeRenderable(renderable: Renderable): void {
    const index = this._renderables.indexOf(renderable);
    if (index > -1) {
      this._renderables.splice(index, 1);
    }
    const materialImplementation = renderable.getMaterial();
    const value = this._sharedMaterialMeshRenderablesMap.get(
      materialImplementation._getMaterial(),
    );
    if (value) {
      Scene._removeRenderablesFromMeshRenderableMap(
        renderable,
        value.meshRenderableMap,
      );
      if (value.meshRenderableMap.size === 0) {
        value.materialImplementation._destroy();
        this._sharedMaterialMeshRenderablesMap.delete(
          materialImplementation._getMaterial(),
        );
      }
    }
  }

  getRenderables(): Renderable[] {
    return this._renderables;
  }

  getMaterials(): Material[] {
    return Array.from(this._sharedMaterialMeshRenderablesMap.keys());
  }

  getSharedMaterialMeshRenderables(): MaterialImplementationMeshRenderablesMapPair[] {
    return Array.from(this._sharedMaterialMeshRenderablesMap.values());
  }

  /** @internal */
  _release(): void {
    // TODO
  }

  /** @internal */
  _setupBuffersAndUniforms(renderer: Renderer): void {
    this._sharedMaterialMeshRenderablesMap.forEach(
      ({ meshRenderableMap, materialImplementation }, material) => {
        const device = renderer._getDevice();
        const renderPipeline = material._setupRenderPipeline(device);
        let uniformBuffer = materialImplementation._getUniformBuffer();
        if (!uniformBuffer) {
          const instanceCount: number = Array.from(
            meshRenderableMap.values(),
          ).reduce((a, b) => a + b.length, 0);
          uniformBuffer = materialImplementation._setupUniformBuffer(
            device,
            instanceCount,
          );
        }
        meshRenderableMap.forEach((renderables, mesh) => {
          mesh._createVertexBuffer(renderer);
          renderables.forEach((renderable, index) => {
            if (!uniformBuffer) return;
            renderable._setupUniformBindGroup(
              renderer._getDevice(),
              renderPipeline,
              uniformBuffer,
              index,
            );
          });
        });
      },
    );
  }
}
