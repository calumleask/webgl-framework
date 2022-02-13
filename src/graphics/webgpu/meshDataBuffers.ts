
let nextBufferId = 0;
const getNextBufferId = (): number => {
  return ++nextBufferId;
};

export class MeshDataBuffers {
  private _buffers: Map<number, GPUBuffer>;
  private _device: GPUDevice;

  constructor(device: GPUDevice) {
    this._buffers = new Map;
    this._device = device;
  }

  createDataBuffer(vertices: Float32Array): number {
    const buffer = this._device.createBuffer({
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });

    new Float32Array(buffer.getMappedRange()).set(vertices);
    buffer.unmap();
    const bufferId = getNextBufferId();
    this._buffers.set(bufferId, buffer);
    return bufferId;
  }

  getBuffer(bufferId: number): GPUBuffer | null {
    const buffer = this._buffers.get(bufferId);
    return buffer || null;
  }
}
