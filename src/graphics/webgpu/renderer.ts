import { mat4, vec3 } from "gl-matrix";

import { cubePipeline } from "./cube";

// TODO: move
import { WebGPUCanvas as Canvas } from "./canvas";
import { Scene } from "./scene";

export class Renderer {
  private _adapter: GPUAdapter | null;
  private _device: GPUDevice | null;
  private _swapChain: GPUSwapChain | null;

  private _renderPassDesc: GPURenderPassDescriptor | null;

  // TODO: move to camera
  private _viewMatrix: mat4;
  private _projectionMatrix: mat4;

  constructor() {
    this._adapter = null;
    this._device = null;
    this._swapChain = null;
    this._renderPassDesc = null;

    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();
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
    this._swapChain = context.configureSwapChain({
      device: this._device,
      format: "bgra8unorm"
    });

    const depthTexture = this._device.createTexture({
      size: {
        width: canvas.getCanvasSizefv()[0],
        height: canvas.getCanvasSizefv()[1],
      },
      format: "depth24plus-stencil8",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this._renderPassDesc = {
      colorAttachments: [
        {
          view: undefinedGPUTextureView,
          loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          storeOp: "store" as GPUStoreOp
        }
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),

        depthLoadValue: 1.0,
        depthStoreOp: "store" as GPUStoreOp,
        stencilLoadValue: 0,
        stencilStoreOp: "store" as GPUStoreOp,
      },
    };

    cubePipeline.init(this._device);

    // TODO: move to camera
    mat4.translate(this._viewMatrix, this._viewMatrix, vec3.fromValues(0, 0, -7));

    const aspect = Math.abs(canvas.getCanvasSizefv()[0] / canvas.getCanvasSizefv()[1]);
    this._projectionMatrix = mat4.create();
    mat4.perspective(this._projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

    return;
  }

  render(scene: Scene): void {
    if (!this._adapter || !this._device || !this._swapChain || !this._renderPassDesc) {
      return;
      // TODO: error
    }

    scene.getLayerIds().forEach(layerId => {
      const objects = scene.getObjectsToDrawForLayer(layerId);
      objects.forEach(object => {
        // TODO: use materials instead
        object.assignMaterial(cubePipeline);
      });
    });

    scene.getLayerIds().forEach(layerId => {
      const objects = scene.getObjectsToDrawForLayer(layerId);
      objects.forEach(object => {
        // TODO: pass camera?
        object.updateMatrix(this._viewMatrix, this._projectionMatrix);
      });
    });

    scene.getLayerIds().forEach(layerId => {
      const objects = scene.getObjectsToDrawForLayer(layerId);
      objects.forEach(object => {
        const modelViewProjectionMatrix = object.getModelViewProjectionMatrix();
        if (!modelViewProjectionMatrix) return;
        const uniformBuffer = cubePipeline.getUniformBuffer();
        if (!uniformBuffer) return;
        this._device?.queue.writeBuffer(
          uniformBuffer,
          0,
          modelViewProjectionMatrix.buffer,
          modelViewProjectionMatrix.byteOffset,
          modelViewProjectionMatrix.byteLength
        );
      });
    });

    this._renderPassDesc.colorAttachments[0].view = this._swapChain.getCurrentTexture().createView();

    const commandEncoder = this._device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(this._renderPassDesc);

    const renderPipeline = cubePipeline.getRenderPipeline();
    if (!renderPipeline) return;
    passEncoder.setPipeline(renderPipeline);

    const dataBuffer = cubePipeline.getDataBuffer();
    if (!dataBuffer) return;
    passEncoder.setVertexBuffer(0, dataBuffer);

    scene.getLayerIds().forEach(layerId => {
      const objects = scene.getObjectsToDrawForLayer(layerId);
      objects.forEach(object => {
        const uniformBindGroup = object.getUniformBindGroup();
        if (!uniformBindGroup) return;

        passEncoder.setBindGroup(0, uniformBindGroup);
        passEncoder.draw(object.getVertexCount(), 1, 0, 0);
      });
    });

    passEncoder.endPass();

    this._device.queue.submit([commandEncoder.finish()]);
  }
}

const undefinedGPUTextureView: GPUTextureView = { label: null, __brand: "GPUTextureView" };
