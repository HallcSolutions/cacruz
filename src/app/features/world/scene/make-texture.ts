import { CanvasTexture, LinearFilter, SRGBColorSpace, Texture } from 'three';

/**
 * Texturas dibujadas en un canvas 2D. Es la vía para meter texto y logos dentro de la escena
 * sin cargar fuentes 3D ni geometría de tipografía: se pinta plano y se pega sobre una cara.
 */

const LABEL_WIDTH = 512;
const LABEL_HEIGHT = 160;

export interface LabelOptions {
  readonly background: string;
  readonly color: string;
  readonly fontSize?: number;
}

/** Letrero con texto: para los nombres de tecnologías y los carteles de cada zona. */
export function labelTexture(text: string, options: LabelOptions): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = LABEL_WIDTH;
  canvas.height = LABEL_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return blankTexture();
  }

  ctx.fillStyle = options.background;
  ctx.fillRect(0, 0, LABEL_WIDTH, LABEL_HEIGHT);

  ctx.fillStyle = options.color;
  ctx.font = `600 ${options.fontSize ?? 76}px ui-monospace, "Cascadia Code", Consolas, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, LABEL_WIDTH / 2, LABEL_HEIGHT / 2, LABEL_WIDTH - 40);

  return finish(new CanvasTexture(canvas));
}

/**
 * Logo o ilustración desde un archivo. Devuelve la textura al momento y la rellena cuando la
 * imagen llega: así la escena arranca sin esperar a la red.
 *
 * Sirve igual para PNG y para SVG porque el navegador rasteriza ambos en un `<img>`.
 */
export function imageTexture(url: string, background: string): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');
  const texture = new CanvasTexture(canvas);

  if (ctx) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 512, 512);

    const image = new Image();
    image.onload = () => {
      const scale = Math.min(432 / image.width, 432 / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.drawImage(image, (512 - width) / 2, (512 - height) / 2, width, height);
      texture.needsUpdate = true;
    };
    image.src = url;
  }

  return finish(texture);
}

/**
 * Degradado radial que se desvanece a transparente. Es lo que convierte un resplandor en un
 * halo suave: con un plano de opacidad plana se ven los bordes rectos del rectángulo.
 */
export function radialGlowTexture(): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.35, 'rgba(255,255,255,0.42)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  return finish(new CanvasTexture(canvas));
}

function blankTexture(): Texture {
  return finish(new CanvasTexture(document.createElement('canvas')));
}

function finish(texture: Texture): Texture {
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  return texture;
}
