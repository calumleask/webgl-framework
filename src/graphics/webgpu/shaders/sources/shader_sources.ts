import { basicVertexSource } from "./vertex/basic";

import { basicFragmentSource } from "./fragment/basic";

// TODO: create a method
export const shaderSources = {
  basic: {
    vertex: basicVertexSource,
    fragment: basicFragmentSource
  }
};
