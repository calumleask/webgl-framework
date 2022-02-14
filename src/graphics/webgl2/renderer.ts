import { Vec2 } from '../../math';
import { Uniforms } from './uniforms';

import { shaderSources } from './shaders/sources/shader_sources';
import { Program, ProgramInfo, AttributeSetters } from './shaders/program';

// TODO: move
import { WebGLCanvas as Canvas } from './canvas';
import { Scene } from './scene';

// TODO: shaders and program created externally.

const createShader = (glContext: WebGL2RenderingContext, type: number, source: string): WebGLShader | null => {
  const shader = glContext.createShader(type);
  if (!shader) return null;

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

const createProgram = (glContext: WebGL2RenderingContext): Program | null => {
  const shaderSource = shaderSources.colored;
  const vertexShader = createShader(glContext, glContext.VERTEX_SHADER, shaderSource.vertex);
  const fragmentShader = createShader(glContext, glContext.FRAGMENT_SHADER, shaderSource.fragment);

  if (!vertexShader || !fragmentShader) return null;

  const program = new Program();
  program.createProgram(glContext, vertexShader, fragmentShader);
  return program;
};

type Buffers = {
  position: WebGLBuffer
};

type ProgramInfoWithVertexArray = {
  programInfo: ProgramInfo;
  vertexArray: WebGLVertexArrayObject;
};

type GlobalUniforms = Uniforms & {
  u_resolution: Vec2;
};

type Attributes = {
  a_position: {
    buffer: WebGLBuffer;
    numComponents: number;
  };
};

export class Renderer {
  private _program: Program | null;
  private _programInfoWithVertexArray: ProgramInfoWithVertexArray | null;

  constructor() {
    this._program = null;

    // TODO: might have multiple
    this._programInfoWithVertexArray = null;
  }

  // TODO: do elsewhere.
  init(canvas: Canvas): void {
    const glContext = canvas.getContext();

    if (!glContext) {
      return;
      // TODO: error
    }
    this._program = createProgram(glContext);
    if (!this._program) {
      return;
      // TODO: error
    }

    const quadBuffers = this._createBuffers(glContext);
    if (!quadBuffers) {
      return;
      // TODO: error
    }

    // TODO: make type for this
    const attribs: Attributes = {
      a_position: { buffer: quadBuffers.position, numComponents: 2 }
    };

    const vertexArrayObject = this._createVAOAndSetAttributes(glContext, this._program.getProgramInfo().attribSetters, attribs);
    if (!vertexArrayObject) {
      return;
      // TODO: error
    }

    // Collect all the info needed to use the shader program.
    // Look up which attrib our shader program is using
    // for a_position and look up uniform locations.
    this._programInfoWithVertexArray = {
      programInfo: this._program.getProgramInfo(),
      vertexArray: vertexArrayObject
    };
  }

  private _createBuffers(glContext: WebGL2RenderingContext): Buffers | null {
    const positions = [
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1
    ];

    const positionBuffer = glContext.createBuffer();
    if (!positionBuffer) return null;
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW);

    return {
      position: positionBuffer
    };
  }

  private _createVAOAndSetAttributes(glContext: WebGL2RenderingContext, attribSetters: AttributeSetters, attribs: Attributes): WebGLVertexArrayObject | null  {
    const vertexArrayObject = glContext.createVertexArray();
    if (!vertexArrayObject) return null;
    glContext.bindVertexArray(vertexArrayObject);

    Object.keys(attribs).forEach(attribName => {

      switch (attribName) {
      case 'a_position': {
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

  private _setUniforms(glContext: WebGL2RenderingContext, programInfo: ProgramInfo, uniforms: Uniforms): void {
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

  render(canvas: Canvas, scene: Scene): void {
    const glContext = canvas.getContext();
    if (!glContext) {
      return;
      // TODO: error
    }
    // Tell WebGL how to convert from clip space to pixels
    glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);

    // Clear the canvas
    glContext.clearColor(0, 0, 0, 1); // TODO: set clear color value elsewhere
    glContext.clear(glContext.COLOR_BUFFER_BIT); // TODO: set elsewhere

    // Tell it to use our program (pair of shaders)
    if (!this._programInfoWithVertexArray) {
      return;
      // TODO: error
    }
    const { programInfo, vertexArray } = this._programInfoWithVertexArray;
    glContext.useProgram(programInfo.program); // TODO: set program info outside this class?

    // Bind the attrib/buffer set we want.
    glContext.bindVertexArray(vertexArray);

    const globalUniforms: GlobalUniforms = {
      u_resolution: canvas.getCanvasSizefv()
    };

    this._setUniforms(glContext, programInfo, globalUniforms);

    // draw
    const primitiveType = glContext.TRIANGLES;
    const offset = 0;
    const count = 6;

    scene.getLayerIds().forEach(layerId => {
      const objects = scene.getObjectsToDrawForLayer(layerId);

      objects.forEach(object => {
        this._setUniforms(glContext, programInfo, object.getUniforms());

        glContext.drawArrays(primitiveType, offset, count);
      });
    });
  }
}
