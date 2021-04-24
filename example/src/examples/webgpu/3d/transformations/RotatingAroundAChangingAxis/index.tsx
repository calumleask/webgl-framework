import React, { useEffect } from "react";

import { graphics } from "webgl-framework";
import { mat4, vec3 } from "gl-matrix";

export const RotatingAroundAChangingAxisExample: React.FC = () => {

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
      const now = Date.now() / 1000;

      const rotationMatrix = mat4.rotate(
        mat4.create(),
        mat4.identity(mat4.create()),
        now,
        vec3.fromValues(Math.sin(now), Math.cos(now), 0)
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
