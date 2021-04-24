import React, { useEffect } from "react";

import { graphics } from "webgl-framework";

export const CubeExample: React.FC = () => {

  useEffect(() => {
    const canvas = new graphics.webgpu.Canvas("glCanvas");
    const renderer = new graphics.webgpu.Renderer(canvas);

    const camera = new graphics.webgpu.Camera(75, canvas.getAspect())
      .setPosition([5, 5, 5])
      .setFocalPoint([0, 0, 0]);

    const scene = new graphics.webgpu.Scene();
    const cubeMesh = new graphics.webgpu.CubeMesh();
    const basicMaterial = new graphics.webgpu.BasicMaterial();
    const renderable = new graphics.webgpu.Renderable(cubeMesh, basicMaterial);
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
