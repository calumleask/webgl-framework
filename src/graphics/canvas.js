
export default class WebGLCanvas {
    constructor() {
        this._canvas = null;
        this._gl = null;
    }

    init(canvasId) {
        this._canvas = document.querySelector("#" + canvasId);
        // TODO: check this worked.

        // Initialize the GL context
        this._gl = this._canvas.getContext("webgl2");

        // Only continue if WebGL is available and working
        if (!this._gl) {
            alert("Unable to initialize WebGL2. Your browser or machine may not support it.");
            return;
        }       
    }

    getContext() {
        return this._gl;
    }
    
    getCanvasSizefv() {
        if (this._gl && this._gl.canvas) {
            return [this._gl.canvas.width, this._gl.canvas.height];
        }
        return [];
    }
}