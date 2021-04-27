
// TODO: move
import { WebGPUCanvas as Canvas } from "./canvas";
import { MeshDataBuffers } from "./meshDataBuffers";
import { Camera } from "./camera";
import { Scene } from "./scene";

export class Renderer {
  private _device: GPUDevice;
  private _swapChain: GPUSwapChain;

  private _dataBuffers: MeshDataBuffers;

  private _renderPassDesc: GPURenderPassDescriptor;

  private _ready: boolean;

  private _activeScene: Scene | null;

  constructor(canvas: Canvas) {
    this._activeScene = null;

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
    this._activeScene._setupBuffersAndUniforms(this);
  }

  /** @internal */
  _getDevice(): GPUDevice {
    return this._device;
  }

  /** @internal */
  _getDataBuffers(): MeshDataBuffers {
    return this._dataBuffers;
  }

  render(scene: Scene, camera: Camera): void {
    if (!this._ready) return;
    this._initScene(scene);

    const viewMatrix = camera.getViewMatrix();
    const projectionMatrix = camera.getProjectionMatrix();

    scene.getRenderables().forEach(renderable => {
      // TODO: use a dirty flag
      renderable._updateMatrix(viewMatrix, projectionMatrix);
    });

    this._renderPassDesc.colorAttachments[0].view = this._swapChain.getCurrentTexture().createView();

    const commandEncoder = this._device.createCommandEncoder();
    // TODO: Is this per material?

    for (const { meshRenderableMap, materialImplementation } of scene.getSharedMaterialMeshRenderables()) {
      const passEncoder = commandEncoder.beginRenderPass(this._renderPassDesc);

      const uniformBuffer = materialImplementation._getUniformBuffer();
      if (!uniformBuffer) return;

      const renderPipeline = materialImplementation._getMaterialRenderPipeline();
      if (!renderPipeline) return;

      passEncoder.setPipeline(renderPipeline);

      for (const [mesh, renderables] of Array.from(meshRenderableMap.entries())) {

        const offset = 256;

        const dataBuffer = this._dataBuffers.getBuffer(mesh.getVertexBufferId());
        if (!dataBuffer) return;
        passEncoder.setVertexBuffer(0, dataBuffer);

        renderables.forEach((renderable, index) => {
          const modelViewProjectionMatrix = renderable._getModelViewProjectionMatrix();
          if (!modelViewProjectionMatrix) return;

          this._device.queue.writeBuffer(
            uniformBuffer,
            index * offset,
            modelViewProjectionMatrix.buffer,
            modelViewProjectionMatrix.byteOffset,
            modelViewProjectionMatrix.byteLength
          );

          const uniformBindGroup = renderable._getUniformBindGroup();
          if (!uniformBindGroup) return;

          passEncoder.setBindGroup(0, uniformBindGroup);
          passEncoder.draw(mesh.getVertexCount(), 1, 0, 0);
        });


      }

      // TODO: Is this per material?
      passEncoder.endPass();

      this._device.queue.submit([commandEncoder.finish()]);
    }

  }
}

const undefinedGPUTextureView: GPUTextureView = { label: null, __brand: "GPUTextureView" };
