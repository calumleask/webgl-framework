import { mat4, vec3 } from "gl-matrix";

export class Camera {
  private _viewMatrix: mat4;
  private _projectionMatrix: mat4;
  private _position: vec3;

  constructor(fovDeg: number, aspect: number, near = 1, far = 100.0) {
    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();
    this._position = vec3.create();

    this._projectionMatrix = mat4.create();
    const fovRad = fovDeg * Math.PI / 180;
    mat4.perspective(this._projectionMatrix, fovRad, aspect, near, far);
  }

  getViewMatrix(): mat4 {
    return this._viewMatrix;
  }

  getProjectionMatrix(): mat4 {
    return this._projectionMatrix;
  }

  getPos(): vec3 {
    return vec3.clone(this._position);
  }

  getPosX(): number {
    return this._position[0];
  }

  getPosY(): number {
    return this._position[1];
  }

  getPosZ(): number {
    return this._position[2];
  }

  setPos(position: vec3): this {
    this._position[0] = position[0];
    this._position[1] = position[1];
    this._position[2] = position[2];
    this._updateViewMatrix();
    return this;
  }

  setPosX(x: number): this {
    this._position[0] = x;
    this._updateViewMatrix();
    return this;
  }

  setPosY(y: number): this {
    this._position[1] = y;
    this._updateViewMatrix();
    return this;
  }

  setPosZ(z: number): this {
    this._position[2] = z;
    this._updateViewMatrix();
    return this;
  }

  /** @internal */
  private _updateViewMatrix(): void {
    mat4.translate(this._viewMatrix, mat4.create(), this._position);
  }

}
