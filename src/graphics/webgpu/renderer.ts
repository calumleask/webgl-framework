import { mat4, vec3 } from "gl-matrix";

// TODO: move
import { WebGPUCanvas as Canvas } from "./canvas";
import { MeshDataBuffers } from "./meshDataBuffers";
import { Scene } from "./scene";

export class Renderer {
  private _device: GPUDevice;
  private _swapChain: GPUSwapChain;

  private _dataBuffers: MeshDataBuffers;

  private _renderPassDesc: GPURenderPassDescriptor;

  private _ready: boolean;

  // TODO: move to camera
  private _viewMatrix: mat4;
  private _projectionMatrix: mat4;

  private _activeScene: Scene | null;

  constructor(canvas: Canvas) {
    this._activeScene = null;

    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();

    this._ready = false;

    this._init(canvas)
      .then(({ context, device }) => {
        this._ready = true;
        this._device = device;

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

        this._dataBuffers = new MeshDataBuffers(this._device);
      })
      .catch((err) => {
        console.error(err);
      });

    // TODO: move to camera
    mat4.translate(this._viewMatrix, this._viewMatrix, vec3.fromValues(0, 0, -7));

    const aspect = Math.abs(canvas.getCanvasSizefv()[0] / canvas.getCanvasSizefv()[1]);
    this._projectionMatrix = mat4.create();
    mat4.perspective(this._projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);
  }

  /** @internal */
  private async _init(canvas: Canvas): Promise<{ context: GPUCanvasContext, device: GPUDevice }> {
    if (!navigator.gpu) {
      throw Error("WebGPU is not supported/enabled in your browser.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw Error("WebGPU is not supported/enabled in your browser.");
    }

    const device = await adapter.requestDevice();
    if (!device) {
      throw Error("WebGPU is not supported/enabled in your browser.");
    }

    const context = canvas.getContext();
    if (!context) {
      throw Error("WebGPU is not supported/enabled in your browser.");
    }

    return {
      context, device
    };
  }

  /** @internal */
  private _initScene(scene: Scene): void {
    if (this._activeScene === scene) return;
    this._activeScene?._release();
    this._activeScene = scene;
    this._activeScene._setup(this);
  }

  /** @internal */
  _getDevice(): GPUDevice {
    return this._device;
  }

  /** @internal */
  _getDataBuffers(): MeshDataBuffers {
    return this._dataBuffers;
  }

  render(scene: Scene): void {
    if (!this._ready) return;
    this._initScene(scene);

    scene.getRenderables().forEach(renderable => {
      // TODO: pass camera?
      renderable.updateMatrix(this._viewMatrix, this._projectionMatrix);
    });

    scene.getRenderables().forEach(renderable => {
      // TODO: pass camera?
      renderable.updateMatrix(this._viewMatrix, this._projectionMatrix);
    });

    scene.getRenderables().forEach(renderable => {
      const modelViewProjectionMatrix = renderable.getModelViewProjectionMatrix();
      if (!modelViewProjectionMatrix) return;
      const uniformBuffer = renderable.getMaterial().getUniformBuffer();
      if (!uniformBuffer) return;
      this._device?.queue.writeBuffer(
        uniformBuffer,
        0,
        modelViewProjectionMatrix.buffer,
        modelViewProjectionMatrix.byteOffset,
        modelViewProjectionMatrix.byteLength
      );
    });

    this._renderPassDesc.colorAttachments[0].view = this._swapChain.getCurrentTexture().createView();

    const commandEncoder = this._device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(this._renderPassDesc);

    scene.getRenderables().forEach(renderable => {
      const renderPipeline = renderable.getMaterial().getRenderPipeline();
      if (!renderPipeline) return;
      passEncoder.setPipeline(renderPipeline);

      const dataBuffer = this._dataBuffers.getBuffer(renderable.getMesh().getVertexBufferId());
      if (!dataBuffer) return;
      passEncoder.setVertexBuffer(0, dataBuffer);

      const uniformBindGroup = renderable.getUniformBindGroup();
      if (!uniformBindGroup) return;

      passEncoder.setBindGroup(0, uniformBindGroup);
      passEncoder.draw(renderable.getMesh().getVertexCount(), 1, 0, 0);
    });

    passEncoder.endPass();

    this._device.queue.submit([commandEncoder.finish()]);
  }
}

const undefinedGPUTextureView: GPUTextureView = { label: null, __brand: "GPUTextureView" };
