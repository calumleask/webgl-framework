import { Material } from '../material';
import { MaterialImplementation } from '../materialImplementation';

import { shaderSources } from '../shaders/sources/shader_sources';

import { Mesh } from '../mesh';

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
                format: 'float32x4' as GPUVertexFormat
              },
              {
                // color
                shaderLocation: 1,
                offset: Mesh.ColorOffset,
                format: 'float32x4' as GPUVertexFormat
              }
            ]
          }
        ]
      },
      fragment: {
        shaderSource: shaderSources.basic.fragment,
        format: 'bgra8unorm'
      },
      primitive: {
        topology: 'triangle-list'
      }
    });
  }

}

// TODO: use repository
const material = new BasicMaterial();

export class BasicMaterialImplementation extends MaterialImplementation {

  constructor() {
    super(material);
  }

  /** @internal */
  _createUniformBindGroup(device: GPUDevice, renderPipeline: GPURenderPipeline, uniformBuffer: GPUBuffer, offset: number): GPUBindGroup {
    const matrixSize = 4 * 16;
    const uniformBindGroup = device.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
            offset: offset,
            size: matrixSize,
          },
        },
      ],
    });

    return uniformBindGroup;
  }

}
