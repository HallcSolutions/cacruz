import { CanvasTexture, LinearFilter, Sprite, SpriteMaterial } from 'three';

/**
 * La terminal sobre la cabeza del personaje: teclea un comando y se apaga sola.
 * Es un sprite (siempre mira a la cámara) con una textura que se redibuja mientras teclea.
 */
export class TerminalBubble {
  readonly sprite: Sprite;
  private readonly canvas = document.createElement('canvas');
  private readonly texture: CanvasTexture;
  private command = '';
  private shown = 0;
  private ttl = 0;

  constructor() {
    this.canvas.width = 512;
    this.canvas.height = 96;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.minFilter = LinearFilter;
    this.sprite = new Sprite(new SpriteMaterial({ map: this.texture, transparent: true, depthWrite: false }));
    this.sprite.scale.set(3.6, 0.68, 1);
    this.sprite.visible = false;
  }

  type(command: string): void {
    this.command = command;
    this.shown = 0;
    this.ttl = 2.2;
    this.sprite.visible = true;
  }

  update(delta: number): void {
    if (!this.sprite.visible) {
      return;
    }
    this.ttl -= delta;
    if (this.ttl <= 0) {
      this.sprite.visible = false;
      return;
    }
    const next = Math.min(this.command.length, this.shown + delta * 34);
    if (Math.floor(next) !== Math.floor(this.shown) || this.ttl < 0.4) {
      this.draw(this.command.slice(0, Math.floor(next)), this.ttl < 0.4 ? this.ttl / 0.4 : 1);
    }
    this.shown = next;
  }

  private draw(text: string, alpha: number): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, 512, 96);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(10,10,14,0.88)';
    ctx.strokeStyle = 'rgba(167,139,250,0.9)';
    ctx.lineWidth = 3;
    roundRect(ctx, 4, 4, 504, 88, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.textBaseline = 'middle';
    /* El comando completo tiene que caber en la caja: se mide y se baja la fuente hasta que quepa. */
    const line = '$ ' + this.command;
    let fontSize = 34;
    do {
      ctx.font = `600 ${fontSize}px ui-monospace, "Cascadia Code", Consolas, monospace`;
      fontSize -= 2;
    } while (ctx.measureText(line + '▍').width > 468 && fontSize > 14);
    ctx.fillText('$ ' + text + (Math.floor(this.shown * 4) % 2 ? '▍' : ' '), 22, 48);
    this.texture.needsUpdate = true;
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
