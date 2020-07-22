import { basicVertexSource } from "./vertex/basic";
import { texturedVertexSource } from "./vertex/textured";

import { basicFragmentSource } from "./fragment/basic";
import { coloredFragmentSource } from "./fragment/colored";
import { texturedFragmentSource } from "./fragment/textured";

// TODO: create a method
export const shaderSources = {
    basic: {
        vertex: basicVertexSource,
        fragment: basicFragmentSource
    },
    colored: {
        vertex: basicVertexSource,
        fragment: coloredFragmentSource
    },
    textured: {
        vertex: texturedVertexSource,
        fragment: texturedFragmentSource
    }
};
