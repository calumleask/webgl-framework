import { Vec2, Vec3, Vec4 } from "~/math";
import { Renderable, RenderableUniforms } from "./Renderable";



export class Quad implements Renderable {
    private _position: Vec2;
    private _scale: Vec2;
    private _color: Vec4;

    constructor(x = 0, y = 0, w = 1, h = w) {
        this._position = [x, y];
        this._scale = [w, h];
        this._color = [1.0, 0.0, 0.0, 1.0];
    }

    getUniforms(): RenderableUniforms {
        return {
            u_translation: this._position,
            u_scale: this._scale,
            u_color: this._color
        };
    }

    getPosition(): Vec2 {
        return this._position;
    }

    setPosition(position: Vec2): void {
        this._position[0] = position[0];
        this._position[1] = position[1];
    }

    getWidth(): number {
        return this._scale[0];
    }

    setWidth(w: number): void {
        this._scale[0] = w;
    }

    getHeight(): number {
        return this._scale[1];
    }

    setHeight(h: number): void {
        this._scale[1] = h;
    }

    getColorRGBA(): Vec4 {
        return this._color;
    }

    setColorRGBA(rgba: Vec4): void {
        this._color[0] = rgba[0];
        this._color[1] = rgba[1];
        this._color[2] = rgba[2];
        this._color[3] = rgba[3];
    }

    setColorRGB(rgb: Vec3): void {
        this._color[0] = rgb[0];
        this._color[1] = rgb[1];
        this._color[2] = rgb[2];
    }

    setAlpha(a: number): void {
        this._color[3] = a;
    }
}
