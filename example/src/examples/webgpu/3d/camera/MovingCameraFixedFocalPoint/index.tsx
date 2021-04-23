import React, { useEffect } from "react";

import { glMatrix, graphics } from "webgl-framework";

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
        camera.setPosition(glMatrix.vec3.add(glMatrix.vec3.create(), camera.getPosition(), camera.getForwardVector()));
        break;
      }
      case "s": {
        camera.setPosition(glMatrix.vec3.add(glMatrix.vec3.create(), camera.getPosition(), camera.getForwardVector()));
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
