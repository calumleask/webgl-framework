
type ProgramableStageBase = {
  shaderSource: string;
}

type PipelineState = {
  vertex: ProgramableStageBase & {
    buffers?: Iterable<GPUVertexBufferLayout | null>;
  },
  fragment: ProgramableStageBase & {
    format: GPUTextureFormat;
  },
  primitive: {
    topology: GPUPrimitiveTopology;
  }
};

export abstract class Material {
  private _renderPipeline: GPURenderPipeline | null;

  private _pipelineState: PipelineState;
  private _bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor | null;

  constructor(pipelineState: PipelineState, bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor | null = null) {
    this._renderPipeline = null;

    this._pipelineState = pipelineState;
    this._bindGroupLayoutDescriptor = bindGroupLayoutDescriptor;
  }

  /** @internal */
  _setupRenderPipeline(device: GPUDevice): GPURenderPipeline {
    if (!this._renderPipeline) {
      this._renderPipeline = Material._createPipeline(device, this._pipelineState, this._bindGroupLayoutDescriptor);
    }

    return this._renderPipeline;
  }

  /** @internal */
  private static _createPipeline(device: GPUDevice, pipelineState: PipelineState, bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor | null): GPURenderPipeline {
    const pipeline = device.createRenderPipeline({
      ...(
        bindGroupLayoutDescriptor ? {
          layout: device.createPipelineLayout({
            bindGroupLayouts: [device.createBindGroupLayout(bindGroupLayoutDescriptor)],
          })
        } : {}
      ),
      vertex: {
        module: device.createShaderModule({
          code: pipelineState.vertex.shaderSource
        }),
        entryPoint: "main",
        buffers: pipelineState.vertex.buffers,
      },
      fragment: {
        module: device.createShaderModule({
          code: pipelineState.fragment.shaderSource
        }),
        entryPoint: "main",
        targets: [
          {
            format: pipelineState.fragment.format
          }
        ]
      },
      primitive: {
        topology: pipelineState.primitive.topology,
        cullMode: "back"
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus-stencil8"
      }
    });

    return pipeline;
  }

  /** @internal */
  _getRenderPipeline(): GPURenderPipeline | null {
    return this._renderPipeline;
  }

}
