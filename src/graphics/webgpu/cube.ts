import { Vec2, Vec3, Vec4 } from "../../math";
import { Renderable } from "./Renderable";

import { Pipeline } from "./pipeline";
import { shaderSources } from "./shaders/sources/shader_sources";

export class Cube extends Renderable {
  private _position: Vec2;
  private _scale: Vec2;
  private _color: Vec4;

  static _dataBuf: GPUBuffer | null = null;

  constructor(x = 0, y = 0, w = 1, h = w) {
    super();
    this._position = [x, y];
    this._scale = [w, h];
    this._color = [1.0, 0.0, 0.0, 1.0];
  }

  getVertexCount(): number {
    return cubeVertexCount;
  }

  getPosition(): Vec2 {
    return this._position;
  }

  setPosition(position: Vec2): this {
    this._position[0] = position[0];
    this._position[1] = position[1];
    return this;
  }

  getWidth(): number {
    return this._scale[0];
  }

  setWidth(w: number): this {
    this._scale[0] = w;
    return this;
  }

  getHeight(): number {
    return this._scale[1];
  }

  setHeight(h: number): this {
    this._scale[1] = h;
    return this;
  }

  getColorRGBA(): Vec4 {
    return this._color;
  }

  setColorRGBA(rgba: Vec4): this {
    this._color[0] = rgba[0];
    this._color[1] = rgba[1];
    this._color[2] = rgba[2];
    this._color[3] = rgba[3];
    return this;
  }

  setColorRGB(rgb: Vec3): this {
    this._color[0] = rgb[0];
    this._color[1] = rgb[1];
    this._color[2] = rgb[2];
    return this;
  }

  setAlpha(a: number): this {
    this._color[3] = a;
    return this;
  }

}

export const cubeVertexSize = 4 * 10; // Byte size of one cube vertex.
export const cubePositionOffset = 0;
export const cubeColorOffset = 4 * 4; // Byte offset of cube vertex color attribute.
export const cubeUVOffset = 4 * 8;
export const cubeVertexCount = 36;

// prettier-ignore
export const cubeVertexArray = new Float32Array([
  // float4 position, float4 color, float2 uv,
  1, -1, 1, 1,   1, 0, 1, 1,  1, 1,
  -1, -1, 1, 1,  0, 0, 1, 1,  0, 1,
  -1, -1, -1, 1, 0, 0, 0, 1,  0, 0,
  1, -1, -1, 1,  1, 0, 0, 1,  1, 0,
  1, -1, 1, 1,   1, 0, 1, 1,  1, 1,
  -1, -1, -1, 1, 0, 0, 0, 1,  0, 0,

  1, 1, 1, 1,    1, 1, 1, 1,  1, 1,
  1, -1, 1, 1,   1, 0, 1, 1,  0, 1,
  1, -1, -1, 1,  1, 0, 0, 1,  0, 0,
  1, 1, -1, 1,   1, 1, 0, 1,  1, 0,
  1, 1, 1, 1,    1, 1, 1, 1,  1, 1,
  1, -1, -1, 1,  1, 0, 0, 1,  0, 0,

  -1, 1, 1, 1,   0, 1, 1, 1,  1, 1,
  1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
  1, 1, -1, 1,   1, 1, 0, 1,  0, 0,
  -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
  -1, 1, 1, 1,   0, 1, 1, 1,  1, 1,
  1, 1, -1, 1,   1, 1, 0, 1,  0, 0,

  -1, -1, 1, 1,  0, 0, 1, 1,  1, 1,
  -1, 1, 1, 1,   0, 1, 1, 1,  0, 1,
  -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,
  -1, -1, -1, 1, 0, 0, 0, 1,  1, 0,
  -1, -1, 1, 1,  0, 0, 1, 1,  1, 1,
  -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,

  1, 1, 1, 1,    1, 1, 1, 1,  1, 1,
  -1, 1, 1, 1,   0, 1, 1, 1,  0, 1,
  -1, -1, 1, 1,  0, 0, 1, 1,  0, 0,
  -1, -1, 1, 1,  0, 0, 1, 1,  0, 0,
  1, -1, 1, 1,   1, 0, 1, 1,  1, 0,
  1, 1, 1, 1,    1, 1, 1, 1,  1, 1,

  1, -1, -1, 1,  1, 0, 0, 1,  1, 1,
  -1, -1, -1, 1, 0, 0, 0, 1,  0, 1,
  -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,
  1, 1, -1, 1,   1, 1, 0, 1,  1, 0,
  1, -1, -1, 1,  1, 0, 0, 1,  1, 1,
  -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,
]);

export class CubePipeline extends Pipeline {

  constructor() {
    super();
  }

  init(device: GPUDevice): void {
    super.init(device, {
      vertex: {
        shaderSource: shaderSources.basic.vertex,
        buffers: [
          {
            arrayStride: cubeVertexSize,
            attributes: [
              {
                // position
                shaderLocation: 0,
                offset: cubePositionOffset,
                format: "float32x4" as GPUVertexFormat
              },
              {
                // color
                shaderLocation: 1,
                offset: cubeColorOffset,
                format: "float32x4" as GPUVertexFormat
              }
            ]
          }
        ]
      },
      fragment: {
        shaderSource: shaderSources.basic.fragment,
        swapChainFormat: "bgra8unorm"
      },
      primitive: {
        topology: "triangle-list"
      }
    },
    cubeVertexArray);
  }
}

export const cubePipeline = new CubePipeline;
