import { Material } from "../material";

import { shaderSources } from "../shaders/sources/shader_sources";

import { Mesh } from "../mesh";
import { Texture } from "../texture";

export class TexturedMaterial extends Material {
  private _texture: Texture | null;
  private _sampler: GPUSampler | null;

  constructor() {
    super({
      vertex: {
        shaderSource: shaderSources.textured.vertex,
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
                // uv
                shaderLocation: 1,
                offset: Mesh.UVOffset,
                format: "float32x2" as GPUVertexFormat
              }
            ]
          }
        ]
      },
      fragment: {
        shaderSource: shaderSources.textured.fragment,
        swapChainFormat: "bgra8unorm"
      },
      primitive: {
        topology: "triangle-list"
      }
    },
    {
      entries: [
        {
          // Transform
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "uniform" as GPUBufferBindingType
          }
        },
        {
          // Sampler
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {
            type: "filtering" as GPUSamplerBindingType
          }
        },
        {
          // Texture view
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {
            sampleType: "float" as GPUTextureSampleType
          }
        }
      ]
    });

    this._texture = null;
    this._sampler = null;
  }

  setTexture(texture: Texture): this {
    this._texture = texture;
    if (this._device) {
      this._setup(this._device);
    }
    return this;
  }

  /** @internal */
  private _createSampler(device: GPUDevice): GPUSampler {
    if (this._sampler) return this._sampler;

    this._sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    });

    return this._sampler;
  }

  /** @internal */
  protected _createUniformBindGroup(device: GPUDevice, renderPipeline: GPURenderPipeline, uniformBuffer: GPUBuffer): void {
    const sampler = this._createSampler(device);

    this._texture?._init(device);
    let texture = this._texture?._getTexture();
    if (!texture) {
      texture = Texture._getDefaultTexture(device);
      this._texture?._onLoad(() => {
        if (this._device) {
          this._setup(this._device);
        }
      });
    }

    const matrixSize = 4 * 16;
    this._uniformBindGroup = device.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
            offset: 0,
            size: matrixSize
          }
        },
        {
          binding: 1,
          resource: sampler,
        },
        {
          binding: 2,
          resource: texture.createView()
        }
      ]
    });
  }
}
