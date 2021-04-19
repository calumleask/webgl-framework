// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Vec2, Vec4 } from "../math";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Uniforms } from "./uniforms";

export type RenderableUniforms = Uniforms & {
  u_translation: Vec2;
  u_scale: Vec2;
  u_color: Vec4;
};

export interface Renderable {
  getUniforms(): RenderableUniforms;
}
