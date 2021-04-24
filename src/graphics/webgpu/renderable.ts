import { mat4, vec3 } from "gl-matrix";

import { Material } from "./material";
import { Mesh } from "./mesh";
import { Renderer } from "./renderer";

const matrixSize = 4 * 16;

export class Renderable {
  private _mesh: Mesh;
  private _material: Material;

  private _uniformBindGroup: GPUBindGroup | null;

  private _position: vec3;
  private _transformationMatrix: mat4;

  private _modelMatrix: mat4;
  private _modelViewProjectionMatrix: Float32Array;

  constructor(mesh: Mesh, material: Material) {
    this._mesh = mesh;
    this._material = material;

    this._uniformBindGroup = null;

    this._position = vec3.create();
    this._transformationMatrix = mat4.create();

    this._modelMatrix = mat4.create();
    this._modelViewProjectionMatrix = mat4.create() as Float32Array;
  }

  getMesh(): Mesh {
    return this._mesh;
  }

  getMaterial(): Material {
    return this._material;
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
  _getUniformBindGroup(): GPUBindGroup | null {
    return this._uniformBindGroup;
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
      this._modelViewProjectionMatrix
    );
  }

  /** @internal */
  _setupBuffers(renderer: Renderer): void {
    this._mesh._createVertexBuffer(renderer);
    const device = renderer._getDevice();
    const renderPipeline = this._material._createPipeline(device);
    const uniformBuffer = this._material._createUniformBuffer(device);

    if (this._uniformBindGroup) return;
    this._uniformBindGroup = device.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
            offset: 0,
            size: matrixSize,
          },
        },
      ],
    });
  }

}
