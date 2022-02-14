
export const texturedVertexSource = `
  struct Uniforms {
    modelViewProjectionMatrix : mat4x4<f32>;
  };

  @binding(0) @group(0) var<uniform> uniforms : Uniforms;
  
  struct VertexOutput {
    @builtin(position) Position : vec4<f32>;
    @location(0) fragUV : vec2<f32>;
  };
  
  @stage(vertex)
  fn main(@location(0) position : vec4<f32>,
          @location(1) uv : vec2<f32> ) -> VertexOutput {
    var output : VertexOutput;
    output.Position = uniforms.modelViewProjectionMatrix * position;
    output.fragUV = uv;
    return output;
  }
`;
