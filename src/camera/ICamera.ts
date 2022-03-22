import { mat4 } from 'gl-matrix';

export interface ICamera {
  getViewMatrix: () => mat4;

  getProjectionMatrix: () => mat4;
}
