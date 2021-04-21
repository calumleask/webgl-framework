
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

export class Material {
  private _renderPipeline: GPURenderPipeline | null;
  private _dataBuffer: GPUBuffer | null;
  private _uniformBuffer: GPUBuffer | null;

  private _pipelineState: PipelineState;

  constructor(pipelineState: PipelineState) {
    this._renderPipeline = null;
    this._dataBuffer = null;
    this._uniformBuffer = null;

    this._pipelineState = pipelineState;
  }

  _createPipeline(device: GPUDevice): GPURenderPipeline {
    if (this._renderPipeline) return this._renderPipeline;
    this._renderPipeline = device.createRenderPipeline({
      vertex: {
        module: device.createShaderModule({
          code: this._pipelineState.vertex.shaderSource
        }),
        entryPoint: "main",
        buffers: this._pipelineState.vertex.buffers,
      },
      fragment: {
        module: device.createShaderModule({
          code: this._pipelineState.fragment.shaderSource
        }),
        entryPoint: "main",
        targets: [
          {
            format: this._pipelineState.fragment.swapChainFormat
          }
        ]
      },
      primitive: {
        topology: this._pipelineState.primitive.topology,
        cullMode: "back"
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus-stencil8"
      }
    });

    return this._renderPipeline;
  }

  _createUniformBuffer(device: GPUDevice): GPUBuffer {
    const matrixSize = 4 * 16; // 4x4 matrix
    const offset = 256; // uniformBindGroup offset must be 256-byte aligned
    const uniformBufferSize = offset + matrixSize;

    this._uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    return this._uniformBuffer;
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
