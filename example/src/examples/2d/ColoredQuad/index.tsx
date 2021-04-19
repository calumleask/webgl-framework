import React, { useEffect } from "react";

import * as glfw from "webgl-framework";

export const ColoredQuadExample: React.FC = () => {

  useEffect(() => {
    const canvas = new glfw.graphics.webgl2.Canvas();
    const renderer = new glfw.graphics.webgl2.Renderer();
    const scene = new glfw.graphics.webgl2.Scene();
    const square = new glfw.graphics.webgl2.Quad(100, 100, 100, 100);

    console.log(canvas);
    console.log(renderer);
    console.log(scene);
    console.log(square);

    canvas.init("glCanvas");

    renderer.init(canvas);

    scene.addObjectToLayer(0, square);

    renderer.render(canvas, scene);
  }, []);

  return (
    <>
      <canvas id="glCanvas" width="750" height="500"></canvas>
    </>
  );
};
