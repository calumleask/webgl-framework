import React, { useEffect } from "react";

import * as glfw from "webgl-framework";

export const ColoredQuadExample: React.FC = () => {

  useEffect(() => {
    const canvas = new glfw.graphics.webgpu.Canvas();
    const renderer = new glfw.graphics.webgpu.Renderer();
    const scene = new glfw.graphics.webgpu.Scene();
    const cube = new glfw.graphics.webgpu.Cube(100, 100, 100, 100);

    canvas.init("glCanvas");

    renderer.init(canvas);

    scene.addObjectToLayer(0, cube);

    const frame = (): void => {
      renderer.render(scene);
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
