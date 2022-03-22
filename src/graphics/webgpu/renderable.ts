import { mat4, vec3 } from 'gl-matrix';

import { MaterialImplementation } from './materialImplementation';
import { Mesh } from './mesh';

export class Renderable {
  private _mesh: Mesh;
  private _material: MaterialImplementation;

  private _position: vec3;
  private _transformationMatrix: mat4;

  private _modelMatrix: mat4;
  private _modelViewProjectionMatrix: Float32Array;

  private _uniformBindGroup: GPUBindGroup | null;

  constructor(mesh: Mesh, material: MaterialImplementation) {
    this._mesh = mesh;
    this._material = material;

    this._position = vec3.create();
    this._transformationMatrix = mat4.create();

    this._modelMatrix = mat4.create();
    this._modelViewProjectionMatrix = mat4.create() as Float32Array;

    this._uniformBindGroup = null;
  }

  getMesh(): Mesh {
    return this._mesh;
  }

  getMaterial(): MaterialImplementation {
    return this._material;
  }

  /** @internal */
  _getUniformBindGroup(): GPUBindGroup | null {
    return this._uniformBindGroup;
  }

  setPosition(pos: vec3): this {
    vec3.copy(this._position, pos);
    mat4.translate(this._modelMatrix, mat4.identity(this._modelMatrix), pos);
    return this;
  }

  getTransformationMatrix(): mat4 {
    return this._transformationMatrix;
  }

  setTransformationMatrix(mat: mat4): this {
    mat4.copy(this._transformationMatrix, mat);
    return this;
  }

  /** @internal */
  _getModelViewProjectionMatrix(): Float32Array {
    return this._modelViewProjectionMatrix;
  }

  /** @internal */
  _updateMatrix(viewMatrix: mat4, projectionMatrix: mat4): void {
    const tmpMat = mat4.create();
    mat4.multiply(tmpMat, this._modelMatrix, this._transformationMatrix);
    mat4.multiply(this._modelViewProjectionMatrix, viewMatrix, tmpMat);
    mat4.multiply(
      this._modelViewProjectionMatrix,
      projectionMatrix,
      this._modelViewProjectionMatrix,
    );
  }

  /** @internal */
  _setupUniformBindGroup(
    device: GPUDevice,
    renderPipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    instanceNumber: number,
  ): void {
    const offset = 256; // uniformBindGroup offset must be 256-byte aligned
    // TODO: this is gross
    this._uniformBindGroup = this._material._createUniformBindGroup(
      device,
      renderPipeline,
      uniformBuffer,
      offset * instanceNumber,
    );
    if (this._material._isReady() === false) {
      this._material._onReady(() => {
        this._uniformBindGroup = this._material._createUniformBindGroup(
          device,
          renderPipeline,
          uniformBuffer,
          offset * instanceNumber,
        );
      });
    }
  }
}
