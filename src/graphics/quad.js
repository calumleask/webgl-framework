
export default class Quad {

    constructor(x, y, w, h) {
        if (x === undefined) x = 0;
        if (y === undefined) y = x;
        this._position = [x, y];
        if (w === undefined) w = 1;
        if (h === undefined) h = w;
        this._scale = [w, h];
        this._color = [1.0, 0.0, 0.0, 1.0];
    }

    getUniforms() {
        return {
            u_translation: this._position,
            u_scale: this._scale,
            u_color: this._color
        };
    }

    getPosition() {
        // TODO: make vec2 with x and y component
        return this._position;
    }

    setPosition(x, y) {
        this._position[0] = x;
        this._position[1] = y;
    }

    getWidth() {
        return this._scale[0];
    }

    setWidth(w) {
        this._scale[0] = w;
    }

    getHeight() {
        return this._scale[1];
    }

    setHeight(h) {
        this._scale[1] = h;
    }

    getColorRGBA() {
        return this._color;
    }

    setColorRGBA(r, g, b, a) {
        this._color[0] = r;
        this._color[1] = g;
        this._color[2] = b;
        this._color[3] = a;
    }

    setColorRGB(r, g, b) {
        this._color[0] = r;
        this._color[1] = g;
        this._color[2] = b;
    }

    setAlpha(a) {
        this._color[3] = a;
    }
}