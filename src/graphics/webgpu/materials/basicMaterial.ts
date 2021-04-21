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

}
