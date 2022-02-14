import { Material } from './material';

type OnReadyCallback = () => void;

export abstract class MaterialImplementation {
  private _material: Material;
  private _uniformBuffer: GPUBuffer | null;

  protected _ready: boolean;
  protected _onReadyCallback: OnReadyCallback | null;

  constructor(material: Material) {
    this._material = material;
    this._uniformBuffer = null;

    this._ready = true;
  }

  /** @internal */
  _isReady(): boolean {
    return this._ready;
  }

  /** @internal */
  _destroy(): void {
    this._uniformBuffer?.destroy();
  }

  /** @internal */
  _getMaterial(): Material {
    return this._material;
  }

  /** @internal */
  _getMaterialRenderPipeline(): GPURenderPipeline | null {
    return this._material?._getRenderPipeline() || null;
  }

  /** @internal */
  _onReady(callback: OnReadyCallback): void {
    this._onReadyCallback = callback;
  }

  /** @internal */
  _setupUniformBuffer(device: GPUDevice, instanceCount: number): GPUBuffer {
    if (!this._uniformBuffer) {
      this._uniformBuffer = MaterialImplementation._createUniformBuffer(
        device,
        instanceCount,
      );
    }

    return this._uniformBuffer;
  }

  /** @internal */
  private static _createUniformBuffer(
    device: GPUDevice,
    instanceCount: number,
  ): GPUBuffer {
    const matrixSize = 4 * 16; // 4x4 matrix
    const offset = 256; // uniformBindGroup offset must be 256-byte aligned
    const uniformBufferSize = offset * (instanceCount - 1) + matrixSize;

    const uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    return uniformBuffer;
  }

  /** @internal */
  _getUniformBuffer(): GPUBuffer | null {
    return this._uniformBuffer;
  }

  /** @internal */
  abstract _createUniformBindGroup(
    device: GPUDevice,
    renderPipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    offset?: number,
  ): GPUBindGroup;
}
