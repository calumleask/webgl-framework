import React, { useEffect } from "react";

import * as wgf from "webgl-framework";

export const ManyCubesExample: React.FC = () => {

  useEffect(() => {
    const canvas = new wgf.graphics.webgpu.Canvas("glCanvas");
    const renderer = new wgf.graphics.webgpu.Renderer(canvas);

    const camera = new wgf.camera.PerspectiveCamera(75, canvas.getAspect())
      .setPosition([0, 0, 20]);

    const scene = new wgf.graphics.webgpu.Scene();
    const cubeMesh = new wgf.graphics.webgpu.CubeMesh();
    const basicMaterial = new wgf.graphics.webgpu.BasicMaterial();
    const renderables: wgf.graphics.webgpu.Renderable[] = [];

    for (let i = 0; i < 9; ++i) {
      const renderable = new wgf.graphics.webgpu.Renderable(cubeMesh, basicMaterial);
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
