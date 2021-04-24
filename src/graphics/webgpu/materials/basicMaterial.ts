import { Material } from "../material";

import { shaderSources } from "../shaders/sources/shader_sources";

import { Mesh } from "../mesh";

export class BasicMaterial extends Material {

  constructor() {
    super({
      vertex: {
        shaderSource: shaderSources.basic.vertex,
        buffers: [
          {
            arrayStride: Mesh.VertexSize,
            attributes: [
              {
                // position
                shaderLocation: 0,
                offset: Mesh.PositionOffset,
                format: "float32x4" as GPUVertexFormat
              },
              {
                // color
                shaderLocation: 1,
                offset: Mesh.ColorOffset,
                format: "float32x4" as GPUVertexFormat
              }
            ]
          }
        ]
      },
      fragment: {
        shaderSource: shaderSources.basic.fragment,
        swapChainFormat: "bgra8unorm"
      },
      primitive: {
        topology: "triangle-list"
      }
    });
  }

  /** @internal */
  protected _createUniformBindGroup(device: GPUDevice, renderPipeline: GPURenderPipeline, uniformBuffer: GPUBuffer): void {
    if (this._uniformBindGroup) return;

    const matrixSize = 4 * 16;
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
