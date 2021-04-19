import React, { useEffect } from "react";

import * as glfw from "webgl-framework";

export const ColoredQuadExample: React.FC = () => {

  useEffect(() => {
    const canvas = new glfw.graphics.webgpu.Canvas();
    const renderer = new glfw.graphics.webgpu.Renderer();
    // const scene = new glfw.graphics.webgpu.Scene();
    // const square = new glfw.graphics.webgpu.Quad(100, 100, 100, 100);

    console.log(canvas);
    console.log(renderer);
    // console.log(scene);
    // console.log(square);

    canvas.init("glCanvas");

    renderer.init(canvas);

    // scene.addObjectToLayer(0, square);

    const frame = (): void => {
      renderer.render();
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
