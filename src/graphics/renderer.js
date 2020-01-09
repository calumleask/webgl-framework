import { shaderSources } from "~/graphics/shaders/sources/shader_sources.js";
import { Program } from "~/graphics/shaders/program.js";

// TODO: shaders and program created externally.

const createShader = (glContext, type, source) => {
    const shader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);
    const success = glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    
    console.log(glContext.getShaderInfoLog(shader));
    glContext.deleteShader(shader);

    return null;
};

const createProgram = (glContext) => {
    const shaderSource = shaderSources.colored;
    const vertexShader = createShader(glContext, glContext.VERTEX_SHADER, shaderSource.vertex);
    const fragmentShader = createShader(glContext, glContext.FRAGMENT_SHADER, shaderSource.fragment);

    const program = new Program();
    program.createProgram(glContext, vertexShader, fragmentShader);
    return program;
};

export default class Renderer {

    constructor() {
        this._program = null;

        // TODO: might have multiple
        this._programInfoWithVertexArray = {
            programInfo: undefined,
            vertexArray: undefined
        };
    }

    // TODO: do elsewhere.
    init(canvas) {
        const glContext = canvas.getContext();

        this._program = createProgram(glContext);

        const quadBuffers = this._createBuffers(glContext);

        const attribs = {
            a_position: { buffer: quadBuffers.position, numComponents: 2 }
        };

        const vertexArrayObject = this._createVAOAndSetAttributes(glContext, this._program.getProgramInfo().attribSetters, attribs);

        // Collect all the info needed to use the shader program.
        // Look up which attrib our shader program is using
        // for a_position and look up uniform locations.
        this._programInfoWithVertexArray = {
            programInfo: this._program.getProgramInfo(),
            vertexArray: vertexArrayObject
        };
    }

    _createBuffers(glContext) {
        const positions = [
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1
        ];

        const positionBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW);

        return {
            position: positionBuffer
        };
    }

    _createVAOAndSetAttributes(glContext, attribSetters, attribs) {
        const vertexArrayObject = glContext.createVertexArray();
        glContext.bindVertexArray(vertexArrayObject);

        Object.keys(attribs).forEach(attribName => {

            switch (attribName) {
                case "a_position": {
                    glContext.enableVertexAttribArray(attribSetters[attribName].location);

                    glContext.bindBuffer(glContext.ARRAY_BUFFER, attribs[attribName].buffer);

                    // Tell the attrib how to get data out of positionBuffer (ARRAY_BUFFER)
                    const size = attribs[attribName].numComponents;
                    const type = glContext.FLOAT;  // the data is 32bit floats
                    const normalize = false;      // don't normalize the data
                    const stride = 0;             // 0 = move forward size * sizeof(type) each iteration to get the next position
                    const offset = 0;             // start at the beginning of the buffer
                    glContext.vertexAttribPointer(attribSetters[attribName].location, size, type, normalize, stride, offset);
                    break;
                }
            }
        });

        return vertexArrayObject;
    }

    _setUniforms(glContext, programInfo, uniforms) {
        Object.keys(uniforms).forEach(name => {
            const uniformSetter = programInfo.uniformSetters[name];
            if (uniformSetter) {
                switch (uniformSetter.type) {
                    case glContext.FLOAT_VEC2:
                        glContext.uniform2fv(uniformSetter.location, uniforms[name]);
                        break;
                    
                    case glContext.FLOAT_VEC4:
                        glContext.uniform4fv(uniformSetter.location, uniforms[name]);
                        break;
                }
            }
        });
    }

    render(canvas, scene) {
        const glContext = canvas.getContext();
        // Tell WebGL how to convert from clip space to pixels
        glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);

        // Clear the canvas
        glContext.clearColor(0, 0, 0, 1); // TODO: set clear color value elsewhere
        glContext.clear(glContext.COLOR_BUFFER_BIT); // TODO: set elsewhere

        // Tell it to use our program (pair of shaders)
        const { programInfo, vertexArray } = this._programInfoWithVertexArray;
        glContext.useProgram(programInfo.program); // TODO: set program info outside this class?

        // Bind the attrib/buffer set we want.
        glContext.bindVertexArray(vertexArray);

        const globalUniforms = {
            u_resolution: canvas.getCanvasSizefv()
        };

        this._setUniforms(glContext, programInfo, globalUniforms);

        // draw
        var primitiveType = glContext.TRIANGLES;
        var offset = 0;
        var count = 6;

        scene.getLayers().forEach(layer => {
            const objects = scene.getObjectsToDrawForLayer(layer);

            objects.forEach(object => {
                this._setUniforms(glContext, programInfo, object.getUniforms());
        
                glContext.drawArrays(primitiveType, offset, count);
            });
        });
    }
}