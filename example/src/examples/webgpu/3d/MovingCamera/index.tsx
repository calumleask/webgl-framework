import React, { useEffect } from "react";

import * as glfw from "webgl-framework";

export const MovingCameraExample: React.FC = () => {

  useEffect(() => {
    const canvas = new glfw.graphics.webgpu.Canvas("glCanvas");
    const renderer = new glfw.graphics.webgpu.Renderer(canvas);

    const camera = new glfw.graphics.webgpu.Camera(75, canvas.getAspect())
      .setPosZ(-10);

    const scene = new glfw.graphics.webgpu.Scene();
    const cubeMesh = new glfw.graphics.webgpu.CubeMesh();
    const basicMaterial = new glfw.graphics.webgpu.BasicMaterial();
    const renderable = new glfw.graphics.webgpu.Renderable(cubeMesh, basicMaterial);
    scene.addRenderable(renderable);

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      switch (e.key) {
      case "w": {
        camera.setPosZ(camera.getPosZ() + 1);
        break;
      }
      case "s": {
        camera.setPosZ(camera.getPosZ() - 1);
        break;
      }
      case "a": {
        camera.setPosX(camera.getPosX() + 1);
        break;
      }
      case "d": {
        camera.setPosX(camera.getPosX() - 1);
        break;
      }
      case "r": {
        camera.setPosY(camera.getPosY() - 1);
        break;
      }
      case "f": {
        camera.setPosY(camera.getPosY() + 1);
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
