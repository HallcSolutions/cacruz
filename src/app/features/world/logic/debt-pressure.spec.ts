import { advanceDebtEncounter, analyzeDebtEncounter, createDebtEncounter, refactorDebtEncounter, supportDebtEncounter } from './debt-encounter';

describe('Presión y ventanas del jefe (002/R20)', () => {
  const player = { position: { x: 8, z: 0 }, altitude: 0 };
  const ready = () => ({ ...createDebtEncounter(), position: { x: 0, z: 0 }, phase: 'approaching' as const, analyzed: true });
  it('resiste F mientras se acerca o prepara el ataque y los perros no lo interrumpen', () => {
    const state = ready();
    expect(refactorDebtEncounter(state, player.position)).toBe(state);
    const warning = advanceDebtEncounter(state, player, 0.05).state;
    expect(warning.phase).toBe('telegraphing');
    expect(warning.remaining).toBeGreaterThanOrEqual(0.8);
    expect(refactorDebtEncounter(warning, player.position)).toBe(warning);
    expect(supportDebtEncounter(warning)).toBe(warning);
  });
  it('lanza una descarga apuntada al lugar anunciado, con movimiento y evasión por salto', () => {
    const warning = advanceDebtEncounter(ready(), player, 0.05).state;
    const launched = advanceDebtEncounter(warning, { position: { x: 0, z: 8 }, altitude: 0 }, 1.05);
    expect(launched.state.projectiles.length).toBe(5);
    const center = launched.state.projectiles[2];
    expect(center.velocity.x).toBeCloseTo(6.5);
    expect(center.velocity.z).toBeCloseTo(0);
    expect(center.position.x).toBeGreaterThan(2.5);
    expect(launched.hit).toBeFalse();
    const victim = { position: { x: center.position.x + center.velocity.x * 0.1, z: center.position.z }, altitude: 0 };
    expect(advanceDebtEncounter(launched.state, victim, 0.1).hit).toBeTrue();
    expect(advanceDebtEncounter(launched.state, { ...victim, altitude: 0.85 }, 0.1).hit).toBeFalse();
    expect(advanceDebtEncounter(launched.state, victim, 0.1, () => true).state.projectiles.length).toBe(0);
  });
  it('acepta solo un impacto en una recuperación aunque F y el apoyo se repitan', () => {
    let state = { ...ready(), phase: 'recovering' as const, remaining: 1.45 };
    const shot = refactorDebtEncounter(state, player.position);
    const hit = advanceDebtEncounter(shot, player, 0.45);
    expect(hit.corrected).toBeTrue();
    expect(hit.state.hp).toBe(2);
    const supported = supportDebtEncounter(hit.state);
    expect(supported.remaining).toBeLessThanOrEqual(1.8);
    expect(refactorDebtEncounter(supported, player.position)).toBe(supported);
    expect(refactorDebtEncounter({ ...state, analyzed: false }, player.position).correctionIn).toBeNull();
    expect(analyzeDebtEncounter(state).analyzed).toBeTrue();
  });
  it('añade ocho proyectiles radiales en la última fase y limpia al derrotarlo', () => {
    const warning = advanceDebtEncounter({ ...ready(), hp: 1 }, player, 0.05).state;
    const burst = advanceDebtEncounter(warning, player, 1.1).state;
    expect(burst.projectiles.length).toBe(13);
    expect(burst.projectiles.some(b => b.velocity.x < -5)).toBeTrue();
    const ended = advanceDebtEncounter({ ...burst, phase: 'recovering', correctionIn: 0.1 }, player, 0.1);
    expect(ended.state.phase).toBe('defeated');
    expect(ended.state.projectiles).toEqual([]);
    expect(ended.hit).toBeFalse();
  });
  it('apunta correctamente fuera del origen, abre ambos lados del abanico y exige análisis inicial', () => {
    expect(createDebtEncounter().analyzed).toBeFalse();
    const shifted = { ...ready(), position: { x: 3, z: 5 } };
    const warning = advanceDebtEncounter(shifted, { position: { x: 3, z: 19 }, altitude: 0 }, 0.1).state;
    expect(warning.phase).toBe('telegraphing');
    const burst = advanceDebtEncounter(warning, player, 1.05).state.projectiles;
    expect(burst[2].position.x).toBeCloseTo(3);
    expect(burst[2].position.z).toBeCloseTo(7.9);
    expect(burst[2].velocity.z).toBeCloseTo(6.5);
    expect(burst.filter(b => b.velocity.x < 0).length).toBe(2);
    expect(burst.filter(b => b.velocity.x > 0).length).toBe(2);
    const right = advanceDebtEncounter({ ...shifted, phase: 'telegraphing', remaining: 0, aim: { x: 13, z: 5 } }, player, 0.1).state.projectiles[2];
    expect(right.velocity.z).toBeCloseTo(0);
  });

  it('exige tres ciclos completos aun repitiendo F, y permite ganar esquivando', () => {
    let state = { ...ready(), phase: 'approaching' as import('../model/debt-phase').DebtPhase };
    let attacks = 0;
    let elapsed = 0;
    while (state.phase !== 'defeated' && elapsed < 20) {
      state = refactorDebtEncounter(state, player.position);
      const before = state.phase;
      const step = advanceDebtEncounter(state, { ...player, altitude: 1.2 }, 0.02);
      state = step.state;
      if (before !== 'attacking' && state.phase === 'attacking') attacks++;
      expect(step.hit).toBeFalse();
      elapsed += 0.02;
    }
    expect(state.phase).toBe('defeated');
    expect(attacks).toBe(3);
    expect(elapsed).toBeGreaterThan(6);
    expect(state.projectiles).toEqual([]);
  });

});
