import { Material } from '../material';
import { MaterialImplementation } from '../materialImplementation';

import { shaderSources } from '../shaders/sources/shader_sources';

import { Mesh } from '../mesh';
import { Texture } from '../texture';

export class TexturedMaterial extends Material {
  constructor() {
    super(
      {
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
                  format: 'float32x4' as GPUVertexFormat,
                },
                {
                  // uv
                  shaderLocation: 1,
                  offset: Mesh.UVOffset,
                  format: 'float32x2' as GPUVertexFormat,
                },
              ],
            },
          ],
        },
        fragment: {
          shaderSource: shaderSources.textured.fragment,
          format: 'bgra8unorm',
        },
        primitive: {
          topology: 'triangle-list',
        },
      },
      {
        entries: [
          {
            // Transform
            binding: 0,
            visibility: 0x1,
            // FIX:
            // visibility: GPUShaderStage.VERTEX,
            buffer: {
              type: 'uniform' as GPUBufferBindingType,
            },
          },
          {
            // Sampler
            binding: 1,
            visibility: 0x2,
            // FIX:
            // visibility: GPUShaderStage.FRAGMENT,
            sampler: {
              type: 'filtering' as GPUSamplerBindingType,
            },
          },
          {
            // Texture view
            binding: 2,
            visibility: 0x2,
            // FIX:
            // visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: 'float' as GPUTextureSampleType,
            },
          },
        ],
      },
    );
  }
}

// TODO: use repository
const material = new TexturedMaterial();

export class TexturedMaterialImplementation extends MaterialImplementation {
  private _texture: Texture | null;
  private _sampler: GPUSampler | null;

  constructor() {
    super(material);

    this._texture = null;
    this._sampler = null;
  }

  setTexture(texture: Texture): this {
    this._texture = texture;
    this._ready = false;
    // TODO: preload texture
    // TODO: allow textures to be changed
    return this;
  }

  /** @internal */
  private _createSampler(device: GPUDevice): GPUSampler {
    if (this._sampler) return this._sampler;

    this._sampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
    });

    return this._sampler;
  }

  /** @internal */
  _createUniformBindGroup(
    device: GPUDevice,
    renderPipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    offset: number,
  ): GPUBindGroup {
    const sampler = this._createSampler(device);

    this._texture?._init(device);
    let texture = this._texture?._getTexture();
    if (!texture) {
      texture = Texture._getDefaultTexture(device);
      this._texture?._onLoad(() => {
        this._ready = true;
        if (this._onReadyCallback) this._onReadyCallback();
      });
    }

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
        {
          binding: 1,
          resource: sampler,
        },
        {
          binding: 2,
          resource: texture.createView(),
        },
      ],
    });

    return uniformBindGroup;
  }
}
