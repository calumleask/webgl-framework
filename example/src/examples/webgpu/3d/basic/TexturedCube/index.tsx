import React, { useEffect } from 'react';

import * as wgf from 'webgl-framework';

export const TexturedCubeExample: React.FC = () => {
  useEffect(() => {
    const canvas = new wgf.graphics.webgpu.Canvas('glCanvas');
    const renderer = new wgf.graphics.webgpu.Renderer(canvas);

    const camera = new wgf.camera.PerspectiveCamera(75, canvas.getAspect())
      .setPosition([5, 5, 5])
      .setFocalPoint([0, 0, 0]);

    const scene = new wgf.graphics.webgpu.Scene();
    const cubeMesh = new wgf.graphics.webgpu.CubeMesh();
    const texture = new wgf.graphics.webgpu.Texture('square_texture.png');
    const texturedMaterial = new wgf.graphics.webgpu.TexturedMaterial();
    texturedMaterial.setTexture(texture);
    const renderable = new wgf.graphics.webgpu.Renderable(
      cubeMesh,
      texturedMaterial,
    );
    scene.addRenderable(renderable);

    const frame = (): void => {
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
