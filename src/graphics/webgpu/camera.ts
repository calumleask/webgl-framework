import { mat4, vec3 } from "gl-matrix";

export class Camera {
  private _position: vec3;
  private _focalPoint: vec3;
  private _forward: vec3;
  private _up: vec3;
  private _viewMatrix: mat4;
  private _projectionMatrix: mat4;

  private _usingFixedFocalPoint: boolean;

  constructor(fovDeg: number, aspect: number, near = 1, far = 100.0) {
    this._position = vec3.create();
    this._focalPoint = vec3.create();
    this._forward = vec3.create();
    this._up = vec3.create();
    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();
    this._usingFixedFocalPoint = false;

    const fovRad = fovDeg * Math.PI / 180;
    mat4.perspective(this._projectionMatrix, fovRad, aspect, near, far);
    console.log(this._projectionMatrix);


    vec3.set(this._forward, 0, 0, -1);
    vec3.set(this._up, 0, 1, 0);
  }

  getViewMatrix(): mat4 {
    return this._viewMatrix;
  }

  getProjectionMatrix(): mat4 {
    return this._projectionMatrix;
  }

  getPosition(): vec3 {
    return vec3.clone(this._position);
  }

  setPosition(position: vec3): this {
    vec3.set(this._forward, position[0], position[1], position[2]);
    this._updateViewMatrix();
    return this;
  }

  getX(): number {
    return this._position[0];
  }

  setX(x: number): this {
    this._position[0] = x;
    this._updateViewMatrix();
    return this;
  }

  getY(): number {
    return this._position[1];
  }

  setY(y: number): this {
    this._position[1] = y;
    this._updateViewMatrix();
    return this;
  }

  getZ(): number {
    return this._position[2];
  }

  setZ(z: number): this {
    this._position[2] = z;
    this._updateViewMatrix();
    return this;
  }

  setFocalPoint(vec: vec3): this {
    this._usingFixedFocalPoint = true;
    this._focalPoint = vec3.set(vec3.create(), vec[0], vec[1], vec[2]);
    return this;
  }

  getForwardVector(): vec3 {
    return this._forward;
  }

  setForwardVector(vec: vec3): this {
    this._usingFixedFocalPoint = false;
    vec3.set(this._forward, vec[0], vec[1], vec[2]);
    this._updateViewMatrix();
    return this;
  }

  getUpVector(): vec3 {
    return this._up;
  }

  getRightVector(): vec3 {
    // TODO
    return this._up;
  }

  setUpVector(vec: vec3): this {
    vec3.set(this._up, vec[0], vec[1], vec[2]);
    this._updateViewMatrix();
    return this;
  }

  /** @internal */
  private _updateViewMatrix(): void {
    if (!this._usingFixedFocalPoint) {
      vec3.add(this._focalPoint, this._position, this._forward);
    }
    mat4.lookAt(this._viewMatrix, this._position, this._focalPoint, this._up);
  }

}
