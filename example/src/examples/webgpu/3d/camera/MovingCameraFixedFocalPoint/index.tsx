import React, { useEffect } from "react";

import { graphics } from "webgl-framework";
import { vec3 } from "gl-matrix";

export const MovingCameraFixedFocalPointExample: React.FC = () => {

  useEffect(() => {
    const canvas = new graphics.webgpu.Canvas("glCanvas");
    const renderer = new graphics.webgpu.Renderer(canvas);

    const camera = new graphics.webgpu.Camera(75, canvas.getAspect())
      .setFocalPoint([0, 0, 0])
      .setZ(10);

    const scene = new graphics.webgpu.Scene();
    const cubeMesh = new graphics.webgpu.CubeMesh();
    const basicMaterial = new graphics.webgpu.BasicMaterial();
    const renderable = new graphics.webgpu.Renderable(cubeMesh, basicMaterial);
    scene.addRenderable(renderable);

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      switch (e.key) {
      case "w": {
        camera.move(camera.getForwardVector());
        break;
      }
      case "s": {
        camera.move(vec3.scale(vec3.create(), camera.getForwardVector(), -1));
        break;
      }
      case "a":
      case "ArrowLeft": {
        camera.move([-1, 0, 0]);
        break;
      }
      case "d":
      case "ArrowRight": {
        camera.move([1, 0, 0]);
        break;
      }
      case "ArrowUp": {
        camera.move(camera.getUpVector());
        break;
      }
      case "ArrowDown": {
        camera.move(vec3.scale(vec3.create(), camera.getUpVector(), -1));
        break;
      }
      default: break;
      }
    });

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
