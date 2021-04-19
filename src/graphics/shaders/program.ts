
// TODO: move
type UniformSetter = {
  type: number;
  location: WebGLUniformLocation | null;
};

export type UniformSetters = {
  [name: string]: UniformSetter;
};

type AttributeSetter = {
  type: number;
  location: number;
};

export type AttributeSetters = {
  [name: string]: AttributeSetter;
};

export type ProgramInfo = {
  program: WebGLProgram | null;
  uniformSetters: UniformSetters;
  attribSetters: AttributeSetters;
}

export class Program {
  private _program: WebGLProgram | null;
  private _uniformSetters: UniformSetters;
  private _attribSetters: AttributeSetters;

  constructor() {
    this._program = null,
    this._uniformSetters = {};
    this._attribSetters = {};
  }

  createProgram(glContext: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
    const program = this._createProgram(glContext, vertexShader, fragmentShader);
    if (!program) return;
    const uniformSetters = this._createUniformSetters(glContext, program);
    const attribSetters  = this._createAttribSetters(glContext, program);

    this._program = program,
    this._uniformSetters = uniformSetters;
    this._attribSetters = attribSetters;
  }

  getProgramInfo(): ProgramInfo {
    return {
      program: this._program,
      uniformSetters: this._uniformSetters,
      attribSetters: this._attribSetters
    };
  }

  private _createProgram(glContext: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    const program = glContext.createProgram();
    if (!program) return null;
    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);
    const success = glContext.getProgramParameter(program, glContext.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(glContext.getProgramInfoLog(program));
    glContext.deleteProgram(program);

    return null;
  }

  private _createAttribSetters(glContext: WebGL2RenderingContext, program: WebGLProgram): AttributeSetters {
    const attribSetters: AttributeSetters = {};
    const attribCount = glContext.getProgramParameter(program, glContext.ACTIVE_ATTRIBUTES);
    console.log(attribCount, "attribs");
    for (let i = 0; i < attribCount; ++i) {
      const attrib = glContext.getActiveAttrib(program, i);
      if (!attrib) continue;
      const attribName = attrib.name;
      attribSetters[attribName] = {
        type: attrib.type,
        location: glContext.getAttribLocation(program, attrib.name)
      };
    }

    return attribSetters;
  }

  private _createUniformSetters(glContext: WebGL2RenderingContext, program: WebGLProgram): UniformSetters {
    const uniformSetters: UniformSetters = {};
    const uniformCount = glContext.getProgramParameter(program, glContext.ACTIVE_UNIFORMS);
    console.log(uniformCount, "uniforms");
    for (let i = 0; i < uniformCount; ++i) {
      const uniform = glContext.getActiveUniform(program, i);
      if (!uniform) continue;
      const uniformName = uniform.name;
      uniformSetters[uniformName] = {
        type: uniform.type,
        location: glContext.getUniformLocation(program, uniform.name)
      };
    }

    return uniformSetters;
  }
}
