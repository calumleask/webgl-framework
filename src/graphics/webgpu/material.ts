
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

export abstract class Material {
  protected _device: GPUDevice | null;
  protected _uniformBindGroup: GPUBindGroup | null;

  private _renderPipeline: GPURenderPipeline | null;
  private _dataBuffer: GPUBuffer | null;
  private _uniformBuffer: GPUBuffer | null;

  private _pipelineState: PipelineState;
  private _bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor | null;

  constructor(pipelineState: PipelineState, bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor | null = null) {
    this._device = null;
    this._renderPipeline = null;
    this._dataBuffer = null;
    this._uniformBuffer = null;
    this._uniformBindGroup = null;

    this._pipelineState = pipelineState;
    this._bindGroupLayoutDescriptor = bindGroupLayoutDescriptor;
  }

  /** @internal */
  _setup(device: GPUDevice): void {
    this._device = device;
    this._createUniformBindGroup(
      device,
      this._createPipeline(device),
      this._createUniformBuffer(device)
    );
  }

  /** @internal */
  private _createPipeline(device: GPUDevice): GPURenderPipeline {
    if (this._renderPipeline) return this._renderPipeline;

    this._renderPipeline = device.createRenderPipeline({
      ...(
        this._bindGroupLayoutDescriptor ? {
          layout: device.createPipelineLayout({
            bindGroupLayouts: [device.createBindGroupLayout(this._bindGroupLayoutDescriptor)],
          })
        } : {}
      ),
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

  /** @internal */
  private _createUniformBuffer(device: GPUDevice): GPUBuffer {
    if (this._uniformBuffer) return this._uniformBuffer;

    const matrixSize = 4 * 16; // 4x4 matrix
    const offset = 256; // uniformBindGroup offset must be 256-byte aligned
    const uniformBufferSize = offset + matrixSize;

    this._uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    return this._uniformBuffer;
  }

  /** @internal */
  protected abstract _createUniformBindGroup(device: GPUDevice, renderPipeline: GPURenderPipeline, uniformBuffer: GPUBuffer): void;

  /** @internal */
  _getRenderPipeline(): GPURenderPipeline | null {
    return this._renderPipeline;
  }

  /** @internal */
  _getDataBuffer(): GPUBuffer | null {
    return this._dataBuffer;
  }

  /** @internal */
  _getUniformBuffer(): GPUBuffer | null {
    return this._uniformBuffer;
  }

  /** @internal */
  _getUniformBindGroup(): GPUBindGroup | null {
    return this._uniformBindGroup;
  }
}
