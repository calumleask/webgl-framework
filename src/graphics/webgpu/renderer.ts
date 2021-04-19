
import { shaderSources } from "./shaders/sources/shader_sources";

// TODO: move
import { WebGPUCanvas as Canvas } from "./canvas";

export class Renderer {
  private _adapter: GPUAdapter | null;
  private _device: GPUDevice | null;
  private _swapChain: GPUSwapChain | null;
  private _renderPipeline: GPURenderPipeline | null;

  constructor() {
    this._adapter = null;
    this._device = null;
    this._swapChain = null;
    this._renderPipeline = null;
  }

  async init(canvas: Canvas): Promise<void> {
    if (!navigator.gpu) {
      throw Error("WebGPU is not supported/enabled in your browser.");
    }

    this._adapter = await navigator.gpu.requestAdapter();
    if (!this._adapter) {
      return;
      // TODO: error
    }
    this._device = await this._adapter.requestDevice();
    if (!this._device) {
      return;
      // TODO: error
    }

    const context = canvas.getContext();

    if (!context) {
      return;
      // TODO: error
    }

    // Setup render outputs
    const swapChainFormat: GPUTextureFormat = "bgra8unorm";
    this._swapChain = context.configureSwapChain({
      device: this._device,
      format: swapChainFormat
    });

    this._renderPipeline = this._device.createRenderPipeline({
      vertex: {
        module: this._device.createShaderModule({
          code: shaderSources.basic.vertex
        }),
        entryPoint: "main"
      },
      fragment: {
        module: this._device.createShaderModule({
          code: shaderSources.basic.fragment
        }),
        entryPoint: "main",
        targets: [
          {
            format: swapChainFormat
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    });

    return;
  }

  render(): void {
    if (!this._adapter || !this._device || !this._swapChain || !this._renderPipeline) {
      return;
      // TODO: error
    }

    const commandEncoder = this._device.createCommandEncoder();
    const textureView = this._swapChain.getCurrentTexture().createView();

    const colorAttachmentsStoreOp: GPUStoreOp = "store";
    const renderPassDesc: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          storeOp: colorAttachmentsStoreOp
        }
      ]
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
    passEncoder.setPipeline(this._renderPipeline);
    passEncoder.draw(3, 1, 0, 0);
    passEncoder.endPass();

    this._device.queue.submit([commandEncoder.finish()]);
  }
}
