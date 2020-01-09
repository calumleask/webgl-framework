
export const basicVertexSource = `#version 300 es
 
    in vec2 a_position;

    uniform vec2 u_resolution;

    uniform vec2 u_translation;

    uniform vec2 u_scale;

    void main() {
        vec2 scaledPosition = a_position * u_scale;

        vec2 position = scaledPosition + u_translation;

        vec2 zeroToOne = position / u_resolution;

        vec2 zeroToTwo = zeroToOne * 2.0;

        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }

`;