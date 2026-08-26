/**
 * Ladridos. El navegador solo deja sonar audio tras un gesto del usuario, así que se arma al
 * primer teclazo. Si `audio/bark.wav` no existe, no pasa nada: los perros ladran en silencio.
 */
export class BarkAudio {
  private readonly clip = new Audio('audio/bark.wav');
  private ready = false;
  private available = true;

  constructor() {
    this.clip.preload = 'auto';
    this.clip.addEventListener('error', () => {
      this.available = false;
    });
  }

  /** Llamar desde un evento de teclado o puntero. */
  arm(): void {
    this.ready = true;
  }

  /** `pitch` > 1 suena a perro pequeño. */
  bark(pitch: number, volume = 0.5): void {
    if (!this.ready || !this.available) {
      return;
    }
    const voice = this.clip.cloneNode(true) as HTMLAudioElement;
    voice.playbackRate = pitch;
    voice.volume = volume;
    void voice.play().catch(() => undefined);
  }
}
