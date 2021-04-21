import { mat4, vec3 } from "gl-matrix";

export class Camera {
  private _viewMatrix: mat4;
  private _projectionMatrix: mat4;

  constructor(fovDeg: number, aspect: number, near = 1, far = 100.0) {
    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();

    mat4.translate(this._viewMatrix, this._viewMatrix, vec3.fromValues(0, 0, -7));
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

}
