import { Box3, Vector3 } from 'three';
import { activateDebtEncounter } from '../logic/activate-debt-encounter';
import { stepArena } from '../logic/arena';
import { advanceDebtEncounter, createDebtEncounter, startDebtEncounter } from '../logic/debt-encounter';
import { TURRETS } from '../logic/world-zones';
import { INITIAL_ARENA } from '../model/arena-state';
import { DebtMonsterView } from './debt-monster-view';
import { createWorldCamera, positionEncounterCamera } from './world-camera';

describe('Última máquina y aparición visible (002/R2/R11/R15)', () => {
  it('muestra un jefe completo al impactar la última corrección, sin depender de otro disparo', () => {
    const last = TURRETS[TURRETS.length - 1];
    const bugs = Object.fromEntries(TURRETS.map(t => [t.id, t === last ? 1 : 0]));
    const arena = { ...INITIAL_ARENA, bugs, agents: [{ targetId: last.id, position: { ...last.position } }] };
    expect(activateDebtEncounter('inactive', arena, TURRETS)).toBe('inactive');
    const impact = stepArena(arena, TURRETS, { position: { x: 0, z: 0 }, altitude: 0 }, 0, 0.05);
    expect(activateDebtEncounter('inactive', impact.state, TURRETS)).toBe('appearing');
    const state = advanceDebtEncounter(startDebtEncounter(createDebtEncounter()), { position: { x: -2, z: -1 }, altitude: 0 }, 1.6).state;
    const view = new DebtMonsterView();
    view.update(state, { x: -2, z: -1 }, 2, 0.05);
    expect(view.root.visible).toBeTrue();
    const bounds = new Box3().setFromObject(view.root);
    expect(bounds.getSize(new Vector3()).y).toBeGreaterThan(3.6);
    const camera = createWorldCamera(1440 / 900);
    positionEncounterCamera(camera, { x: -2, z: -1 }, state.position, 1);
    const center = bounds.getCenter(new Vector3()).project(camera);
    expect(Math.abs(center.x)).toBeLessThan(0.85);
    expect(Math.abs(center.y)).toBeLessThan(0.85);
    view.dispose();
  });
});
