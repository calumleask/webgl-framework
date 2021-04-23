import { mat4, vec3 } from "gl-matrix";

import { Material } from "./material";
import { Mesh } from "./mesh";
import { Renderer } from "./renderer";

const matrixSize = 4 * 16;

export class Renderable {
  private _mesh: Mesh;
  private _material: Material;

  private _uniformBindGroup: GPUBindGroup | null;

  private _modelMatrix: mat4;
  private _modelViewProjectionMatrix: Float32Array;

  constructor(mesh: Mesh, material: Material) {
    this._mesh = mesh;
    this._material = material;

    this._modelMatrix = mat4.create();
    mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, 0, 0));
    this._modelViewProjectionMatrix = mat4.create() as Float32Array;

    this._uniformBindGroup = null;
  }

  getMesh(): Mesh {
    return this._mesh;
  }

  getMaterial(): Material {
    return this._material;
  }

  getUniformBindGroup(): GPUBindGroup | null {
    return this._uniformBindGroup;
  }

  getModelViewProjectionMatrix(): Float32Array {
    return this._modelViewProjectionMatrix;
  }

  updateMatrix(viewMatrix: mat4, projectionMatrix: mat4): void {
    // const now = Date.now() / 1000;

    const tmpMat4 = mat4.create();

    // mat4.rotate(
    //   tmpMat4,
    //   this._modelMatrix,
    //   1,
    //   vec3.fromValues(Math.sin(now), Math.cos(now), 0)
    // );

    mat4.multiply(this._modelViewProjectionMatrix, viewMatrix, tmpMat4);
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
