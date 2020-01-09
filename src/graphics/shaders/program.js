
export class Program {

    constructor() {
        this._program = null,
        this._uniformSetters = null;
        this._attribSetters = null;
    }

    createProgram(glContext, vertexShader, fragmentShader) {
        const program = this._createProgram(glContext, vertexShader, fragmentShader);
        const uniformSetters = this._createUniformSetters(glContext, program);
        const attribSetters  = this._createAttribSetters(glContext, program);

        this._program = program,
        this._uniformSetters = uniformSetters;
        this._attribSetters = attribSetters;
    }

    getProgramInfo() {
        return {
            program: this._program,
            uniformSetters: this._uniformSetters,
            attribSetters: this._attribSetters
        };
    }

    _createProgram(glContext, vertexShader, fragmentShader) {
        const program = glContext.createProgram();
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

    _createAttribSetters(glContext, program) {
        let attribSetters = [];
        const attribCount = glContext.getProgramParameter(program, glContext.ACTIVE_ATTRIBUTES);
        console.log(attribCount, "attribs");
        for (let i = 0; i < attribCount; ++i) {
            const attrib = glContext.getActiveAttrib(program, i);
            const attribName = attrib.name;
            attribSetters[attribName] = {
                type: attrib.type,
                location: glContext.getAttribLocation(program, attrib.name)
            };
        }

        return attribSetters;
    }
    
    _createUniformSetters(glContext, program) {
        let uniformSetters = {};
        const uniformCount = glContext.getProgramParameter(program, glContext.ACTIVE_UNIFORMS);
        console.log(uniformCount, "uniforms");
        for (let i = 0; i < uniformCount; ++i) {
            const uniform = glContext.getActiveUniform(program, i);
            const uniformName = uniform.name;
            uniformSetters[uniformName] = {
                type: uniform.type,
                location: glContext.getUniformLocation(program, uniform.name)
            };
        }

        return uniformSetters;
    }
}

