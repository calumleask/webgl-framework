import { basicVertexSource } from "~/graphics/shaders/sources/vertex/basic.js";
import { texturedVertexSource } from "~/graphics/shaders/sources/vertex/textured.js";

import { basicFragmentSource } from "~/graphics/shaders/sources/fragment/basic.js";
import { coloredFragmentSource } from "~/graphics/shaders/sources/fragment/colored.js";
import { texturedFragmentSource } from "~/graphics/shaders/sources/fragment/textured.js";

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