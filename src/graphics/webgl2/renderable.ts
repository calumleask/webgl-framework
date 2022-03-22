import { Vec2, Vec4 } from '../../math';
import { Uniforms } from './uniforms';

export type RenderableUniforms = Uniforms & {
  u_translation: Vec2;
  u_scale: Vec2;
  u_color: Vec4;
};

export interface Renderable {
  getUniforms(): RenderableUniforms;
}
