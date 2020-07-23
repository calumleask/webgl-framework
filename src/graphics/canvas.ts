import { Vec2 } from "~/math";

export class WebGLCanvas {
    private _canvas:  HTMLCanvasElement | null;
    private _gl: WebGL2RenderingContext | null;

    constructor() {
        this._canvas = null;
        this._gl = null;
    }

    init(canvasId: string): void {
        this._canvas = document.querySelector("#" + canvasId);
        // TODO: check this worked.

        // Initialize the GL context
        this._gl = this._canvas?.getContext("webgl2") ?? null;

        // Only continue if WebGL is available and working
        if (!this._gl) {
            throw Error("Unable to initialize WebGL2. Your browser or machine may not support it.");
        }
    }

    getContext(): WebGL2RenderingContext | null{
        return this._gl ?? null;
    }

    getCanvasSizefv(): Vec2 {
        if (this._gl?.canvas) {
            return [this._gl.canvas.width, this._gl.canvas.height];
        }
        return [-1, -1];
    }
}
