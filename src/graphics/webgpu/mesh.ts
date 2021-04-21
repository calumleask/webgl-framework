import { Renderer } from "./renderer";

export class Mesh {
  static readonly VertexSize = 4 * 10;
  static readonly PositionOffset = 0;
  static readonly ColorOffset = 4 * 4;
  static readonly UVOffset = 4 * 8;
  protected _vertexArray: Float32Array;
  protected _vertexCount: number;

  private _vertexBufferId: number;

  constructor(vertexArray: Float32Array, vertexCount: number) {
    this._vertexArray = vertexArray;
    this._vertexCount = vertexCount;
    this._vertexBufferId = -1;
  }

  /** @internal */
  _createVertexBuffer(renderer: Renderer): void {
    if (this._vertexBufferId > -1) return;
    this._vertexBufferId = renderer._getDataBuffers().createDataBuffer(this._vertexArray);
  }

  getVertexBufferId(): number {
    return this._vertexBufferId;
  }

  getVertexCount(): number {
    return this._vertexCount;
  }

}
