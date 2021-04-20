import { mat4, vec3 } from "gl-matrix";

import { Pipeline } from "./pipeline";

const matrixSize = 4 * 16;

export abstract class Renderable {
  private _uniformBindGroup: GPUBindGroup | null;

  private _modelMatrix: mat4;
  private _modelViewProjectionMatrix: Float32Array;

  constructor() {
    this._modelMatrix = mat4.create();
    mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(-2, 0, 0));
    this._modelViewProjectionMatrix = mat4.create() as Float32Array;

    this._uniformBindGroup = null;
  }

  abstract getVertexCount(): number;

  getUniformBindGroup(): GPUBindGroup | null {
    return this._uniformBindGroup;
  }

  getModelViewProjectionMatrix(): Float32Array {
    return this._modelViewProjectionMatrix;
  }

  assignMaterial(pipeline: Pipeline): void {
    pipeline.addPipeline(this);
  }

  updateMatrix(viewMatrix: mat4, projectionMatrix: mat4): void {
    const now = Date.now() / 1000;

    const tmpMat4 = mat4.create();

    mat4.rotate(
      tmpMat4,
      this._modelMatrix,
      1,
      vec3.fromValues(Math.sin(now), Math.cos(now), 0)
    );

    mat4.multiply(this._modelViewProjectionMatrix, viewMatrix, tmpMat4);
    mat4.multiply(
      this._modelViewProjectionMatrix,
      projectionMatrix,
      this._modelViewProjectionMatrix
    );
  }

  /** @internal */
  _createBindGroup(device: GPUDevice, pipeline: Pipeline): void {
    if (this._uniformBindGroup) return;
    const renderPipeline = pipeline.getRenderPipeline();
    if (!renderPipeline) return;
    const uniformBuffer = pipeline.getUniformBuffer();
    if (!uniformBuffer) return;
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
