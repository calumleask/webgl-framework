import { Renderable } from "./renderable";

type SceneLayer = {
    objectsToDraw: Renderable[];
};

type SceneLayers = {
    [layerId: string]: SceneLayer;
};

export class Scene {
    private _layers: SceneLayers;

    constructor() {
      this._layers = {};
      // TODO: use
      //this._globalUniforms = [];
    }

    private _getLayer(layerId: number | string): SceneLayer {
      if (typeof layerId === "number") layerId = layerId.toString();
      return this._layers[layerId];
    }

    private _layerExists(layerId: number | string): boolean {
      if (typeof layerId === "number") layerId = layerId.toString();
      return this._layers[layerId] !== undefined;
    }

    private _ensureLayer(layerId: number | string): SceneLayer {
      if (typeof layerId === "number") layerId = layerId.toString();
      if (!this._layerExists(layerId)) {
        this._layers[layerId] = {
          objectsToDraw: []
        };
      }
      return this._layers[layerId];
    }

    private _removeLayer(layerId: number | string): void {
      if (typeof layerId === "number") layerId = layerId.toString();
      if (this._layerExists(layerId)) {
        delete this._layers[layerId];
      }
    }

    addObjectToLayer<T extends Renderable>(layerId: number | string, object: T): void {
      const layer = this._ensureLayer(layerId);
      layer.objectsToDraw.push(object);
    }

    addObjectsToLayer<T extends Renderable>(layerId: number | string, objects: T[]): void {
      const layer = this._ensureLayer(layerId);
      objects.forEach(object => {
        layer.objectsToDraw.push(object);
      });
    }

    removeObjectFromLayer<T extends Renderable>(layerId: number | string, object: T): void {
      if (this._layerExists(layerId)) {
        const layer = this._getLayer(layerId);
        const index = layer.objectsToDraw.indexOf(object);
        if (index === -1) {
          layer.objectsToDraw.splice(index, 1);
        }

        if (layer.objectsToDraw.length === 0) {
          this._removeLayer(layerId);
        }
      }
    }

    addGlobalUniform(): void {
      // TODO
    }

    // Returns array of layer ids
    getLayerIds(): string[] {
      return Object.keys(this._layers);
    }

    getObjectsToDrawForLayer(layerId: number | string): Renderable[] {
      if (this._layerExists(layerId)) {
        return this._getLayer(layerId).objectsToDraw;
      }
      return [];
    }
}
