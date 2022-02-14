import { Vec2 } from '../../math';

export class WebGPUCanvas {
  private _canvas: HTMLCanvasElement | null;
  private _context: GPUCanvasContext | null;

  constructor(canvasId: string) {
    this._canvas = null;
    this._context = null;

    this._init(canvasId);
  }

  /** @interval */
  private _init(canvasId: string): void {
    this._canvas = document.querySelector('#' + canvasId);
    // TODO: check this worked.

    this._context = this._canvas ? this._canvas.getContext('webgpu') : null;

    if (!this._context) {
      console.error(
        'Unable to initialize WebGPU. It may not be supported/enabled in your browser.',
      );
    }
  }

  getElement(): HTMLCanvasElement | null {
    return this._canvas;
  }

  getContext(): GPUCanvasContext | null {
    return this._context;
  }

  getCanvasSizefv(): Vec2 {
    if (this._canvas) {
      return [this._canvas.width, this._canvas.height]; // TODO: width vs clientWidth?
    }
    return [-1, -1];
  }

  getAspect(): number {
    if (this._canvas) {
      return this._canvas.width / this._canvas.height;
    }
    return 1;
  }
}
