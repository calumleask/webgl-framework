import { ICamera } from './ICamera';
import { mat4, vec3 } from 'gl-matrix';

export class PerspectiveCamera implements ICamera {
  private _position: vec3;
  private _focalPoint: vec3;
  private _forward: vec3;
  private _up: vec3;
  private _viewMatrix: mat4;
  private _projectionMatrix: mat4;

  private _usingFixedFocalPoint: boolean;

  private _dirty: boolean;

  constructor(fovDeg: number, aspect: number, near = 1, far = 100.0) {
    this._position = vec3.create();
    this._focalPoint = vec3.create();
    this._forward = vec3.create();
    this._up = vec3.create();
    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();
    this._usingFixedFocalPoint = false;
    this._dirty = false;

    const fovRad = (fovDeg * Math.PI) / 180;
    mat4.perspective(this._projectionMatrix, fovRad, aspect, near, far);

    vec3.set(this._forward, 0, 0, -1);
    vec3.set(this._up, 0, 1, 0);

    this._updateViewMatrix();
  }

  getViewMatrix(): mat4 {
    if (this._dirty) {
      this._updateViewMatrix();
    }
    return this._viewMatrix;
  }

  getProjectionMatrix(): mat4 {
    return this._projectionMatrix;
  }

  getPosition(): vec3 {
    return vec3.clone(this._position);
  }

  setPosition(pos: vec3): this {
    vec3.copy(this._position, pos);
    this._dirty = true;
    return this;
  }

  move(vec: vec3): this {
    vec3.add(this._position, this._position, vec);
    this._dirty = true;
    return this;
  }

  getX(): number {
    return this._position[0];
  }

  setX(x: number): this {
    this._position[0] = x;
    this._dirty = true;
    return this;
  }

  getY(): number {
    return this._position[1];
  }

  setY(y: number): this {
    this._position[1] = y;
    this._dirty = true;
    return this;
  }

  getZ(): number {
    return this._position[2];
  }

  setZ(z: number): this {
    this._position[2] = z;
    this._dirty = true;
    return this;
  }

  setFocalPoint(vec: vec3): this {
    this._usingFixedFocalPoint = true;
    vec3.copy(this._focalPoint, vec);
    this._dirty = true;
    return this;
  }

  getForwardVector(): vec3 {
    return this._forward;
  }

  setForwardVector(forward: vec3): this {
    this._usingFixedFocalPoint = false;
    this._forward = this._normalize(forward);
    this._dirty = true;
    return this;
  }

  getUpVector(): vec3 {
    return this._up;
  }

  setUpVector(up: vec3): this {
    this._up = this._normalize(up);
    this._dirty = true;
    return this;
  }

  getRightVector(): vec3 {
    return this._normalize(vec3.cross(vec3.create(), this._forward, this._up));
  }

  /** @internal */
  private _updateViewMatrix(): void {
    if (this._usingFixedFocalPoint) {
      // Update forward vector
      this._forward = this._normalize(
        vec3.subtract(vec3.create(), this._focalPoint, this._position),
      );
    } else {
      // Update focal point
      vec3.add(this._focalPoint, this._position, this._forward);
    }
    mat4.lookAt(this._viewMatrix, this._position, this._focalPoint, this._up);
    this._dirty = true;
  }

  /** @internal */
  private _normalize(vec: vec3): vec3 {
    return vec3.normalize(vec3.create(), vec);
  }
}
