import React, { useEffect } from "react";

import { graphics } from "webgl-framework";

export const ManyCubesExample: React.FC = () => {

  useEffect(() => {
    const canvas = new graphics.webgpu.Canvas("glCanvas");
    const renderer = new graphics.webgpu.Renderer(canvas);

    const camera = new graphics.webgpu.Camera(75, canvas.getAspect())
      .setPosition([0, 0, 20]);

    const scene = new graphics.webgpu.Scene();
    const cubeMesh = new graphics.webgpu.CubeMesh();
    const basicMaterial = new graphics.webgpu.BasicMaterial();
    const renderables: graphics.webgpu.Renderable[] = [];

    for (let i = 0; i < 9; ++i) {
      const renderable = new graphics.webgpu.Renderable(cubeMesh, basicMaterial);
      renderable.setPosition([10 * Math.cos(i), 10 * Math.sin(i), 0]);
      renderables.push(renderable);
    }
    scene.addRenderables(renderables);

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
