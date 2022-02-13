import React, { useEffect } from "react";

import wgf from "webgl-framework";

export const CubeExample: React.FC = () => {

  useEffect(() => {
    const canvas = new wgf.wgf.graphics.webgpu.Canvas("glCanvas");
    const renderer = new wgf.wgf.graphics.webgpu.Renderer(canvas);

    const camera = new wgf.camera.PerspectiveCamera(75, canvas.getAspect())
      .setPosition([5, 5, 5])
      .setFocalPoint([0, 0, 0]);

    const scene = new wgf.wgf.graphics.webgpu.Scene();
    const cubeMesh = new wgf.wgf.graphics.webgpu.CubeMesh();
    const basicMaterial = new wgf.wgf.graphics.webgpu.BasicMaterial();
    const renderable = new wgf.wgf.graphics.webgpu.Renderable(cubeMesh, basicMaterial);
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
