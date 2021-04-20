import { Renderable } from "./renderable";

type ProgramableStageBase = {
  shaderSource: string;
}

type PipelineState = {
  vertex: ProgramableStageBase & {
    buffers?: Iterable<GPUVertexBufferLayout | null>;
  },
  fragment: ProgramableStageBase & {
    swapChainFormat: GPUTextureFormat;
  },
  primitive: {
    topology: GPUPrimitiveTopology;
  }
};

export abstract class Pipeline {
  private _device: GPUDevice | null;
  private _renderPipeline: GPURenderPipeline | null;
  private _dataBuffer: GPUBuffer | null;
  private _uniformBuffer: GPUBuffer | null;

  constructor() {
    this._device = null;
    this._renderPipeline = null;
    this._dataBuffer = null;
    this._uniformBuffer = null;
  }

  init(device: GPUDevice, state: PipelineState, vertices: Float32Array): void {
    if (this._renderPipeline) return;
    this._device = device;
    this._renderPipeline = this._device.createRenderPipeline({
      vertex: {
        module: this._device.createShaderModule({
          code: state.vertex.shaderSource
        }),
        entryPoint: "main",
        buffers: state.vertex.buffers,
      },
      fragment: {
        module: this._device.createShaderModule({
          code: state.fragment.shaderSource
        }),
        entryPoint: "main",
        targets: [
          {
            format: state.fragment.swapChainFormat
          }
        ]
      },
      primitive: {
        topology: state.primitive.topology,
        cullMode: "back"
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus-stencil8"
      }
    });

    this._dataBuffer = this._device.createBuffer({
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });

    new Float32Array(this._dataBuffer.getMappedRange()).set(vertices);
    this._dataBuffer.unmap();

    const matrixSize = 4 * 16; // 4x4 matrix
    const offset = 256; // uniformBindGroup offset must be 256-byte aligned
    const uniformBufferSize = offset + matrixSize;

    this._uniformBuffer = this._device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  // TODO: remove
  addPipeline(renderable: Renderable): void {
    if (!this._device) return;
    renderable._createBindGroup(this._device, this);
  }

  getRenderPipeline(): GPURenderPipeline | null {
    return this._renderPipeline;
  }

  getDataBuffer(): GPUBuffer | null {
    return this._dataBuffer;
  }

  getUniformBuffer(): GPUBuffer | null {
    return this._uniformBuffer;
  }
}
