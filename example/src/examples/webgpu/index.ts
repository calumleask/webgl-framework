import React from 'react';

type Category = 'basic' | 'transformations' | 'camera';

type Example = {
  title: string;
  example: React.ComponentType;
  category: Category;
  priority: number;
};

// 3D / Basic
import { CubeExample } from './3d/basic/Cube';
export const cube: Example = {
  title: 'Cube',
  example: CubeExample,
  category: 'basic',
  priority: 0,
};

import { TexturedCubeExample } from './3d/basic/TexturedCube';
export const texturedCube: Example = {
  title: 'Textured Cube',
  example: TexturedCubeExample,
  category: 'basic',
  priority: -1,
};

import { ManyCubesExample } from './3d/basic/ManyCubes';
export const manyCubes: Example = {
  title: 'Many Cubes',
  example: ManyCubesExample,
  category: 'basic',
  priority: -2,
};

// 3D / Transformations
import { RotatingAroundAChangingAxisExample } from './3d/transformations/RotatingAroundAChangingAxis';
export const rotatingAroundAChangingAxis: Example = {
  title: 'Rotating Around a Changing Axis',
  example: RotatingAroundAChangingAxisExample,
  category: 'transformations',
  priority: 0,
};

import { RotatingAroundLocalAxisExample } from './3d/transformations/RotatingAroundLocalAxis';
export const rotatingAroundLocalAxis: Example = {
  title: 'Rotating Around Local Axis',
  example: RotatingAroundLocalAxisExample,
  category: 'transformations',
  priority: -1,
};

// 3D / Camera
import { MovingCameraExample } from './3d/camera/MovingCamera';
export const movingCamera: Example = {
  title: 'Moving Camera',
  example: MovingCameraExample,
  category: 'camera',
  priority: 0,
};

import { MovingCameraFixedFocalPointExample } from './3d/camera/MovingCameraFixedFocalPoint';
export const movingCameraFixedFocalPoint: Example = {
  title: 'Moving Camera (Fixed Focal Point)',
  example: MovingCameraFixedFocalPointExample,
  category: 'camera',
  priority: -1,
};
