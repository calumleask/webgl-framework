import React, { useEffect } from "react";

import { graphics } from "webgl-framework";

const loadTexture = async (src: string): Promise<ImageBitmap> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.src = src;
    img.decode()
      .then(() => {
        createImageBitmap(img)
          .then((bitmap) => {
            resolve(bitmap);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const TexturedCubeExample: React.FC = () => {

  useEffect(() => {
    const canvas = new graphics.webgpu.Canvas("glCanvas");
    const renderer = new graphics.webgpu.Renderer(canvas);

    const camera = new graphics.webgpu.Camera(75, canvas.getAspect())
      .setPosition([5, 5, 5])
      .setFocalPoint([0, 0, 0]);

    const scene = new graphics.webgpu.Scene();
    const cubeMesh = new graphics.webgpu.CubeMesh();
    const texturedMaterial = new graphics.webgpu.TexturedMaterial();
    const renderable = new graphics.webgpu.Renderable(cubeMesh, texturedMaterial);
    scene.addRenderable(renderable);

    loadTexture("square_texture.png")
      .then((imageBitmap) => {
        texturedMaterial.setTexture(imageBitmap);
      })
      .catch((err) => {
        console.error(err);
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
