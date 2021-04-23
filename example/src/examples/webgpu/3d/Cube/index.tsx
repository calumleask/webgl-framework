import React, { useEffect } from "react";

import * as glfw from "webgl-framework";

export const CubeExample: React.FC = () => {

  useEffect(() => {
    const canvas = new glfw.graphics.webgpu.Canvas("glCanvas");
    const renderer = new glfw.graphics.webgpu.Renderer(canvas);

    const camera = new glfw.graphics.webgpu.Camera(75, canvas.getAspect())
      .setZ(-10);

    const scene = new glfw.graphics.webgpu.Scene();
    const cubeMesh = new glfw.graphics.webgpu.CubeMesh();
    const basicMaterial = new glfw.graphics.webgpu.BasicMaterial();
    const renderable = new glfw.graphics.webgpu.Renderable(cubeMesh, basicMaterial);
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
