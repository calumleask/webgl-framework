
export default class Scene {

    constructor() {
        this._layers = {};
        this._globalUniforms = [];
    }

    _getLayer(layerId) {
        return this._layers[layerId];
    }

    _layerExists(layerId) {
        return this._layers[layerId] !== undefined;
    }

    _ensureLayer(layerId) {
        if (!this._layerExists(layerId)) {
            this._layers[layerId] = {
                objectsToDraw: []
            };
        }
        return this._layers[layerId];
    }

    _removeLayer(layerId) {
        if (this._layerExists(layerId)) {
            delete this._layers[layerId];
        }
    }

    addObjectToLayer(layerId, object) {
        const layer = this._ensureLayer(layerId);
        layer.objectsToDraw.push(object);
    }

    addObjectsToLayer(layerId, objects) {
        const layer = this._ensureLayer(layerId);
        objects.forEach(object => {
            layer.objectsToDraw.push(object);
        });
    }

    removeObjectFromLayer(layerId, object) {
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

    addGlobalUniform() {
        // TODO
    }

    // Returns array of layer ids
    getLayers() {
        return Object.keys(this._layers);
    }

    getObjectsToDrawForLayer(layerId) {
        if (this._layerExists(layerId)) {
            return this._getLayer(layerId).objectsToDraw;
        }
        return [];
    }
}