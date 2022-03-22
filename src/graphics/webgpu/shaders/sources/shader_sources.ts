import { basicVertexSource } from './vertex/basic';
import { texturedVertexSource } from './vertex/textured';

import { basicFragmentSource } from './fragment/basic';
import { texturedFragmentSource } from './fragment/textured';

// TODO: create a method
export const shaderSources = {
  basic: {
    vertex: basicVertexSource,
    fragment: basicFragmentSource,
  },
  textured: {
    vertex: texturedVertexSource,
    fragment: texturedFragmentSource,
  },
};
