import { advanceDebtEncounter, analyzeDebtEncounter, createDebtEncounter, refactorDebtEncounter, startDebtEncounter, supportDebtEncounter } from './debt-encounter';

describe('Combate final (002/R3–R8/R11/R12)', () => {
  const player = { position: { x: 0, z: -4 }, altitude: 0 };
  const awake = () => advanceDebtEncounter(startDebtEncounter(createDebtEncounter()), player, 2).state;
  const vulnerable = () => ({ ...analyzeDebtEncounter(awake()), phase: 'recovering' as const, remaining: 1.45 });

  it('permite analizar cada fase activa una vez y conserva las fases inertes', () => {
    for (const phase of ['approaching', 'telegraphing', 'attacking', 'recovering'] as const) {
      const state = { ...awake(), phase };
      const scanned = analyzeDebtEncounter(state);
      expect(scanned.analyzed).toBeTrue();
      expect(analyzeDebtEncounter(scanned)).toBe(scanned);
    }
    for (const phase of ['inactive', 'defeated', 'player-defeated'] as const) {
      const state = { ...createDebtEncounter(), phase };
      expect(advanceDebtEncounter(state, player, 2)).toEqual({ state, hit: false, corrected: false });
      expect(analyzeDebtEncounter(state)).toBe(state);
    }
  });

  it('mantiene la entrada hasta completar su duración y permite el borde seguro', () => {
    const entering = { ...startDebtEncounter(createDebtEncounter()), position: { x: 0, z: 0 } };
    const edge = { position: { x: 3.4, z: 0 }, altitude: 0 };
    const step = advanceDebtEncounter(entering, edge, 0.5);
    expect(step.state.phase).toBe('appearing');
    expect(step.state.remaining).toBeCloseTo(1.1);
    expect(step.hit).toBeFalse();
    expect(step.corrected).toBeFalse();
    const occupied = advanceDebtEncounter(entering, { position: { x: 1, z: 0 }, altitude: 0 }, 2);
    expect(occupied.corrected).toBeFalse();
  });

  it('respeta por separado la reserva y la recarga, incluido el instante de impacto', () => {
    const scanned = { ...vulnerable(), position: { x: 8, z: 5 } };
    const from = { x: 17, z: 5 };
    const shot = refactorDebtEncounter(scanned, from);
    expect(shot).not.toBe(scanned);
    const hit = advanceDebtEncounter(shot, { position: from, altitude: 0 }, 0.45);
    expect(hit.corrected).toBeTrue();
    expect(hit.hit).toBeFalse();
    expect(hit.state.correctionIn).toBeNull();
    expect(hit.state.cooldown).toBeCloseTo(1.95);
    expect(refactorDebtEncounter(hit.state, from)).toBe(hit.state);
    const reserved = { ...scanned, correctionIn: 0.2 };
    expect(refactorDebtEncounter(reserved, from)).toBe(reserved);
    expect(advanceDebtEncounter(shot, player, -1).state).toBe(shot);
  });

  it('avanza hacia el jugador con velocidad y distancia de parada acotadas', () => {
    const state = { ...awake(), position: { x: 8, z: 4 } };
    const step = advanceDebtEncounter(state, { position: { x: 20, z: 20 }, altitude: 0 }, 0.2);
    expect(step.state.position.x).toBeCloseTo(8.126);
    expect(step.state.position.z).toBeCloseTo(4.168);
    expect(step.corrected).toBeFalse();
    expect(step.state.correctionIn).toBeNull();
    const stopped = advanceDebtEncounter({ ...state, position: { x: 0, z: 0 } }, { position: { x: 14.1, z: 0 }, altitude: 0 }, 5);
    expect(stopped.state.position.x).toBeCloseTo(0.1);
  });

  it('completa anticipación, golpe, recuperación y siguiente aproximación sin daño repetido', () => {
    const state = { ...awake(), position: { x: 0, z: 0 } };
    const near = { position: { x: 3, z: 0 }, altitude: 0 };
    const warning = advanceDebtEncounter(state, near, 0.1).state;
    expect(warning.phase).toBe('telegraphing');
    expect(advanceDebtEncounter(warning, near, 0.3).state.phase).toBe('telegraphing');
    const edge = { position: { x: 3.4, z: 0 }, altitude: 0 };
    const impact = advanceDebtEncounter(warning, edge, 1.05);
    expect(impact.hit).toBeTrue();
    expect(impact.state.phase).toBe('attacking');
    expect(advanceDebtEncounter(warning, { ...edge, altitude: 0.85 }, 1.05).hit).toBeFalse();
    const recovery = advanceDebtEncounter(impact.state, near, 0.28);
    expect(recovery.state.phase).toBe('recovering');
    expect(recovery.hit).toBeFalse();
    expect(recovery.state.remaining).toBe(1.45);
    const ready = advanceDebtEncounter(recovery.state, near, 1.45);
    expect(ready.state.phase).toBe('approaching');
    expect(ready.state.remaining).toBe(0);
    expect(ready.hit).toBeFalse();
  });

  it('el apoyo respeta recuperaciones largas y el último impacto no golpea al jugador', () => {
    const supported = supportDebtEncounter({ ...vulnerable(), remaining: 1.7 });
    expect(supported.remaining).toBe(1.8);
    const last = { ...supported, hp: 1, correctionIn: 0.2 };
    const ended = advanceDebtEncounter(last, player, 0.2);
    expect(ended.corrected).toBeTrue();
    expect(ended.hit).toBeFalse();
  });

  it('no causa daño durante la entrada y espera si el jugador ocupa el punto de aparición', () => {
    const start = startDebtEncounter(createDebtEncounter());
    const occupied = advanceDebtEncounter(start, { position: start.position, altitude: 0 }, 3);
    expect(occupied.state.phase).toBe('appearing');
    expect(occupied.hit).toBeFalse();
    const safe = advanceDebtEncounter(start, player, 2);
    expect(safe.state.phase).toBe('approaching');
    expect(safe.hit).toBeFalse();
  });

  it('no reinicia un encuentro que ya está activo', () => {
    const state = awake();
    expect(startDebtEncounter(state)).toBe(state);
  });

  it('requiere análisis y alcance antes de reservar una corrección', () => {
    const state = awake();
    expect(refactorDebtEncounter(state, player.position)).toBe(state);
    const scanned = { ...analyzeDebtEncounter(state), phase: 'recovering' as const, remaining: 1.45 };
    expect(scanned.analyzed).toBeTrue();
    expect(refactorDebtEncounter(scanned, { x: 25, z: 25 })).toBe(scanned);
    const fired = refactorDebtEncounter(scanned, player.position);
    expect(fired.correctionIn).toBeGreaterThan(0);
    expect(fired.hp).toBe(3);
    expect(refactorDebtEncounter(fired, player.position)).toBe(fired);
  });

  it('resuelve un hallazgo solo al impactar y nunca vuelve a descontarlo', () => {
    const shot = refactorDebtEncounter(vulnerable(), player.position);
    const travelling = advanceDebtEncounter(shot, player, 0.1);
    expect(travelling.state.hp).toBe(3);
    expect(travelling.corrected).toBeFalse();
    const hit = advanceDebtEncounter(travelling.state, player, 0.5);
    expect(hit.state.hp).toBe(2);
    expect(hit.corrected).toBeTrue();
    expect(advanceDebtEncounter(hit.state, player, 0.1).state.hp).toBe(2);
  });

  it('anticipa al menos 800 ms, permite esquivar y daña una vez por ataque', () => {
    const near = { position: { x: 0, z: -6 }, altitude: 0 };
    const warning = advanceDebtEncounter(awake(), near, 0.05);
    expect(warning.state.phase).toBe('telegraphing');
    expect(warning.state.remaining).toBeGreaterThanOrEqual(0.8);
    expect(warning.hit).toBeFalse();
    const hit = advanceDebtEncounter(warning.state, near, 1.1);
    expect(hit.hit).toBeTrue();
    expect(advanceDebtEncounter(hit.state, near, 0.05).hit).toBeFalse();
    expect(advanceDebtEncounter(warning.state, player, 1.1).hit).toBeFalse();
    expect(advanceDebtEncounter(warning.state, { ...near, altitude: 1.2 }, 1.1).hit).toBeFalse();
  });

  it('respeta obstáculos al aproximarse y conserva el estado en pausa', () => {
    const state = awake();
    const far = { position: { x: 12, z: 5 }, altitude: 0 };
    expect(advanceDebtEncounter(state, far, 0.2, () => true).state.position).toEqual(state.position);
    expect(advanceDebtEncounter(state, far, 0).state).toBe(state);
    expect(advanceDebtEncounter(state, far, 0.2).state.position).not.toEqual(state.position);
  });

  it('la ayuda de los perros no resuelve los hallazgos del jugador ni atraviesa la entrada', () => {
    const entering = startDebtEncounter(createDebtEncounter());
    expect(supportDebtEncounter(entering)).toBe(entering);
    const state = vulnerable();
    const supported = supportDebtEncounter(state);
    expect(supported.hp).toBe(3);
    expect(supported.phase).toBe('recovering');
  });

  it('termina tras tres impactos y no vuelve a atacar, analizar ni disparar', () => {
    let state = vulnerable();
    for (let i = 0; i < 3; i++) {
      state = advanceDebtEncounter(refactorDebtEncounter({ ...state, phase: 'recovering', remaining: 1.45, cooldown: 0 }, player.position), player, 0.7).state as typeof state;
    }
    expect(state.phase).toBe('defeated');
    expect(state.hp).toBe(0);
    expect(advanceDebtEncounter(state, player, 10)).toEqual({ state, hit: false, corrected: false });
    expect(analyzeDebtEncounter(state)).toBe(state);
    expect(refactorDebtEncounter(state, player.position)).toBe(state);
    expect(supportDebtEncounter(state)).toBe(state);
  });
});
