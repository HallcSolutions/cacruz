import { WorldAudio } from './world-audio';

describe('Audio del encuentro (002/R14)', () => {
  it('detiene las voces al pausar o silenciar y descarta eventos durante la pausa', () => {
    const create = spyOn(window, 'AudioContext').and.callThrough();
    const audio = new WorldAudio();
    audio.arm();
    const context = create.calls.mostRecent().returnValue as AudioContext;
    const voice = spyOn(context, 'createBufferSource').and.callThrough();
    audio.play('scan');
    const stop = spyOn(voice.calls.mostRecent().returnValue, 'stop').and.callThrough();
    audio.setPaused(true);
    expect(stop).toHaveBeenCalledTimes(1);
    audio.play('slam');
    expect(voice).toHaveBeenCalledTimes(1);
    audio.setPaused(false);
    expect(voice).toHaveBeenCalledTimes(1);
    audio.play('pulse');
    const stopMuted = spyOn(voice.calls.mostRecent().returnValue, 'stop').and.callThrough();
    audio.setMuted(true);
    expect(stopMuted).toHaveBeenCalledTimes(1);
    audio.dispose();
  });
  it('la ausencia de audio no impide jugar', () => {
    spyOn(window, 'AudioContext').and.throwError('Audio unavailable');
    const audio = new WorldAudio();
    expect(() => { audio.arm(); audio.play('pulse'); audio.dispose(); }).not.toThrow();
  });
  it('no crea audio antes del gesto, y silenciar evita nuevos sonidos', async () => {
    const create = spyOn(window, 'AudioContext').and.callThrough();
    const audio = new WorldAudio();
    audio.play('pulse');
    expect(create).not.toHaveBeenCalled();
    audio.arm();
    expect(create).toHaveBeenCalledTimes(1);
    audio.arm();
    expect(create).toHaveBeenCalledTimes(1);
    const context = create.calls.mostRecent().returnValue as AudioContext;
    const voice = spyOn(context, 'createBufferSource').and.callThrough();
    audio.setMuted(true);
    audio.play('pulse');
    expect(voice).not.toHaveBeenCalled();
    audio.setMuted(false);
    audio.play('pulse');
    expect(voice).toHaveBeenCalledTimes(1);
    const close = spyOn(context, 'close').and.callThrough();
    audio.dispose();
    audio.dispose();
    audio.arm();
    audio.play('impact');
    expect(close).toHaveBeenCalledTimes(1);
    expect(voice).toHaveBeenCalledTimes(1);
  });
});
