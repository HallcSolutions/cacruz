/** Efectos breves de energía y metal. Ningún bucle ni ladrido automático. */
export class WorldAudio {
  private context?: AudioContext;
  private output?: GainNode;
  private muted = false;
  private disposed = false;
  private paused = false;
  private readonly voices = new Set<AudioBufferSourceNode>();

  arm(): void {
    if (this.disposed) return;
    if (!this.context) {
      try { this.context = new AudioContext(); } catch { return; }
      this.output = this.context.createGain();
      this.output.gain.value = this.muted ? 0 : 0.22;
      this.output.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') void this.context.resume().catch(() => undefined);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) this.stopVoices();
    if (this.output && this.context) this.output.gain.setTargetAtTime(muted ? 0 : 0.22, this.context.currentTime, 0.02);
  }

  setPaused(value: boolean): void {
    this.paused = value;
    if (value) this.stopVoices();
  }

  private stopVoices(): void {
    this.voices.forEach(voice => { voice.stop(); voice.disconnect(); });
    this.voices.clear();
  }

  play(kind: 'pulse' | 'impact' | 'scan' | 'merge' | 'slam'): void {
    if (!this.context || !this.output || this.muted || this.disposed || this.paused || this.voices.size >= 6) return;
    const duration = kind === 'scan' ? 0.8 : kind === 'slam' ? 0.65 : 0.23;
    const buffer = this.context.createBuffer(1, Math.ceil(this.context.sampleRate * duration), this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let noise = 0;
    for (let i = 0; i < data.length; i++) {
      const t = i / this.context.sampleRate;
      const phase = t / duration;
      noise = noise * 0.88 + (Math.random() * 2 - 1) * 0.12;
      const envelope = Math.min(1, t / 0.012) * Math.exp(-phase * 6) * (1 - phase);
      const frequency = kind === 'slam' ? 54 : kind === 'impact' ? 130 : kind === 'scan' ? 420 : kind === 'merge' ? 660 : 330;
      const sweep = kind === 'pulse' ? -240 * t * t : kind === 'scan' ? 130 * t * t : 0;
      const tone = Math.sin(2 * Math.PI * (frequency * t + sweep));
      const metal = Math.sin(2 * Math.PI * frequency * 2.73 * t) * Math.exp(-phase * 13);
      data[i] = envelope * (tone * 0.48 + metal * 0.12 + noise * (kind === 'slam' || kind === 'impact' ? 0.65 : 0.12));
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.output);
    this.voices.add(source);
    source.onended = () => { source.disconnect(); this.voices.delete(source); };
    source.start();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stopVoices();
    this.output?.disconnect();
    void this.context?.close();
  }
}
