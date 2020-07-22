import { math } from "~/math";
import { Uniforms } from "./uniforms";

export type RenderableUniforms = Uniforms & {
    u_translation: math.Vec2;
    u_scale: math.Vec2;
    u_color: math.Vec4;
};

export interface Renderable {
    getUniforms(): RenderableUniforms;
}
