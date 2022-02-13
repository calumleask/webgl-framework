
type OnLoadCallback = () => void;

export class Texture {
  private _texture: GPUTexture | null;
  private _imageBitmapOrUrl: ImageBitmap | string | undefined;
  private _onLoadCallback: OnLoadCallback | null;

  private static _defaultTexture: GPUTexture;

  constructor(imageBitmapOrUrl: ImageBitmap | string) {
    this._texture = null;
    this._imageBitmapOrUrl = imageBitmapOrUrl;
    this._onLoadCallback = null;
  }

  /** @internal */
  _init(device: GPUDevice): void {
    if (this._texture) return;
    if (this._imageBitmapOrUrl && typeof this._imageBitmapOrUrl === "string") {
      Texture._loadImage(this._imageBitmapOrUrl)
        .then((bitmap) => {
          this._texture = Texture._createTextureFromBitmap(device, bitmap);
          if (this._onLoadCallback) this._onLoadCallback();
        })
        .catch((err) => {
          console.error(`Error: Could not load texture at source ${this._imageBitmapOrUrl}`, err);
        });
    }
    else if (this._imageBitmapOrUrl instanceof ImageBitmap) {
      this._texture = Texture._createTextureFromBitmap(device, this._imageBitmapOrUrl);
    }
  }

  /** @internal */
  _getTexture(): GPUTexture | null {
    return this._texture;
  }

  /** @internal */
  _onLoad(callback: OnLoadCallback): void {
    this._onLoadCallback = callback;
  }

  /** @internal */
  private static async _loadImage(src: string): Promise<ImageBitmap> {
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
  }

  /** @internal */
  private static _createTextureFromBitmap(device: GPUDevice, bitmap: ImageBitmap): GPUTexture {

    // if (!this._imageBitmap) {
    //   this._imageBitmap = await createImageBitmap(new ImageData(new Uint8ClampedArray([255, 128, 128, 255]), 1, 1));
    // }

    const { width, height } = bitmap;
    const texture = device.createTexture({
      size: [width, height, 1],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });

    if (bitmap) {
      device.queue.copyExternalImageToTexture(
        {
          source: bitmap
        },
        {
          texture: texture
        },
        [width, height, 1]
      );
    }

    return texture;
  }

  /** @internal */
  static _getDefaultTexture(device: GPUDevice): GPUTexture {
    if (!Texture._defaultTexture) {
      Texture._defaultTexture = device.createTexture({
        size: [1, 1, 1],
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      });
    }
    return Texture._defaultTexture;
  }

}
