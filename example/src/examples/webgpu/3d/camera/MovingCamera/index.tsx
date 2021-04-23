import React, { useEffect } from "react";

import * as glfw from "webgl-framework";

export const MovingCameraExample: React.FC = () => {

  useEffect(() => {
    const canvas = new glfw.graphics.webgpu.Canvas("glCanvas");
    const renderer = new glfw.graphics.webgpu.Renderer(canvas);

    const camera = new glfw.graphics.webgpu.Camera(75, canvas.getAspect())
      .setZ(10);

    const scene = new glfw.graphics.webgpu.Scene();
    const cubeMesh = new glfw.graphics.webgpu.CubeMesh();
    const basicMaterial = new glfw.graphics.webgpu.BasicMaterial();
    const renderable = new glfw.graphics.webgpu.Renderable(cubeMesh, basicMaterial);
    scene.addRenderable(renderable);

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      switch (e.key) {
      case "w": {
        camera.setZ(camera.getZ() - 1);
        break;
      }
      case "s": {
        camera.setZ(camera.getZ() + 1);
        break;
      }
      case "a":
      case "ArrowLeft": {
        camera.setX(camera.getX() - 1);
        break;
      }
      case "d":
      case "ArrowRight": {
        camera.setX(camera.getX() + 1);
        break;
      }
      case "ArrowUp": {
        camera.setY(camera.getY() + 1);
        break;
      }
      case "ArrowDown": {
        camera.setY(camera.getY() - 1);
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
