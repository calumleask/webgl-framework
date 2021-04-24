import { Material } from "../material";

import { shaderSources } from "../shaders/sources/shader_sources";

import { Mesh } from "../mesh";

export class TexturedMaterial extends Material {
  private _texture: GPUTexture | null;
  private _sampler: GPUSampler | null;
  private _imageBitmap: ImageBitmap | null;

  constructor(imageBitmap?: ImageBitmap) {
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
    this._imageBitmap = imageBitmap || null;
  }

  setTexture(imageBitmap: ImageBitmap): this {
    this._imageBitmap = imageBitmap;
    if (this._device) {
      this._setup(this._device);
    }
    return this;
  }

  /** @internal */
  private _createTexture(device: GPUDevice): GPUTexture {

    // if (!this._imageBitmap) {
    //   this._imageBitmap = await createImageBitmap(new ImageData(new Uint8ClampedArray([255, 128, 128, 255]), 1, 1));
    // }

    const width = this._imageBitmap?.width || 1;
    const height = this._imageBitmap?.height || 1;
    this._texture = device.createTexture({
      size: [width, height, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST
    });

    if (this._imageBitmap) {
      device.queue.copyImageBitmapToTexture(
        {
          imageBitmap: this._imageBitmap
        },
        {
          texture: this._texture
        },
        [this._imageBitmap.width, this._imageBitmap.height, 1]
      );
    }

    return this._texture;
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
    const texture = this._createTexture(device);

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
