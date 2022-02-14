import React, { useEffect } from 'react';

import * as wgf from 'webgl-framework';
import { mat4, vec3 } from 'gl-matrix';

export const RotatingAroundLocalAxisExample: React.FC = () => {
  useEffect(() => {
    const canvas = new wgf.graphics.webgpu.Canvas('glCanvas');
    const renderer = new wgf.graphics.webgpu.Renderer(canvas);

    const camera = new wgf.camera.PerspectiveCamera(75, canvas.getAspect())
      .setPosition([5, 5, 5])
      .setFocalPoint([0, 0, 0]);

    const scene = new wgf.graphics.webgpu.Scene();
    const cubeMesh = new wgf.graphics.webgpu.CubeMesh();
    const basicMaterial = new wgf.graphics.webgpu.BasicMaterial();
    const renderable = new wgf.graphics.webgpu.Renderable(
      cubeMesh,
      basicMaterial,
    );
    scene.addRenderable(renderable);

    let selectedAxis: 'x' | 'y' | 'z' = 'y';
    const axes: Record<string, vec3> = {
      x: [1, 0, 0],
      y: [0, 1, 0],
      z: [0, 0, 1],
    };

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      switch (e.key) {
        case 'x':
        case 'y':
        case 'z': {
          selectedAxis = e.key;
          break;
        }
        default:
          break;
      }
    });

    const frame = (): void => {
      const rotationMatrix = mat4.rotate(
        mat4.create(),
        renderable.getTransformationMatrix(),
        1 / 100,
        axes[selectedAxis],
      );
      renderable.setTransformationMatrix(rotationMatrix);

      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  return (
    <>
      <canvas id="glCanvas" width="750" height="500"></canvas>
    </>
  );
};
