import { Vec2 } from "../../math";

export class WebGPUCanvas {
  private _canvas:  HTMLCanvasElement | null;
  private _context: GPUCanvasContext | null;

  constructor() {
    this._canvas = null;
    this._context = null;
  }

  init(canvasId: string): void {
    this._canvas = document.querySelector("#" + canvasId);
    // TODO: check this worked.

    // Initialize the WebGPU context
    this._context = this._canvas ? this._canvas.getContext("gpupresent") : null;

    // Only continue if WebGPU is available and working
    if (!this._context) {
      throw Error("Unable to initialize WebGPU. It may not be supported/enabled in your browser.");
    }
  }

  getContext(): GPUCanvasContext | null {
    return this._context;
  }

  getCanvasSizefv(): Vec2 {
    if (this._canvas) {
      return [this._canvas.width, this._canvas.height];
    }
    return [-1, -1];
  }
}
