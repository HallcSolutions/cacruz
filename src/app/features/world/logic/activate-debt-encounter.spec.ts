import { ArenaState, INITIAL_ARENA } from '../model/arena-state';
import { Turret } from '../model/turret';
import { activateDebtEncounter } from './activate-debt-encounter';
import { stepArena } from './arena';

const MACHINES: readonly Turret[] = Array.from({ length: 7 }, (_, index) => ({
  id: `machine-${index}`,
  position: { x: index * 3, z: 5 },
  range: 11,
  cooldown: 2,
  phase: 0,
}));
const LAST_MACHINE = MACHINES[MACHINES.length - 1];
const PLAYER = { position: { x: 50, z: 50 }, altitude: 0 };

function repairedArena(): ArenaState {
  return {
    ...INITIAL_ARENA,
    bugs: Object.fromEntries(MACHINES.map((machine) => [machine.id, 0])),
  };
}

describe('activateDebtEncounter — desbloqueo del jefe final (002/R2)', () => {
  it('permanece inactivo al comenzar con 0/7 máquinas reparadas', () => {
    expect(activateDebtEncounter('inactive', INITIAL_ARENA, MACHINES)).toBe('inactive');
  });

  it('no activa un jefe en una arena sin máquinas', () => {
    expect(activateDebtEncounter('inactive', INITIAL_ARENA, [])).toBe('inactive');
  });

  for (const remaining of MACHINES) {
    it(`permanece inactivo si ${remaining.id} conserva un bug, aunque las otras seis estén reparadas`, () => {
      const arena = repairedArena();
      const unfinished = { ...arena, bugs: { ...arena.bugs, [remaining.id]: 1 } };

      expect(activateDebtEncounter('inactive', unfinished, MACHINES)).toBe('inactive');
    });
  }

  it('considera pendiente una máquina que todavía no tiene entrada en el registro de bugs', () => {
    const arena = {
      ...INITIAL_ARENA,
      bugs: Object.fromEntries(MACHINES.slice(0, -1).map((machine) => [machine.id, 0])),
    };

    expect(activateDebtEncounter('inactive', arena, MACHINES)).toBe('inactive');
  });

  it('no sustituye la última máquina pendiente por un id ajeno que figure reparado', () => {
    const arena = {
      ...INITIAL_ARENA,
      bugs: {
        ...Object.fromEntries(MACHINES.slice(0, -1).map((machine) => [machine.id, 0])),
        unrelated: 0,
      },
    };

    expect(activateDebtEncounter('inactive', arena, MACHINES)).toBe('inactive');
  });

  it('inicia la aparición al completar las siete máquinas', () => {
    expect(activateDebtEncounter('inactive', repairedArena(), MACHINES)).toBe('appearing');
  });

  it('usa el conjunto de máquinas de la arena en lugar de exigir un total fijo de siete', () => {
    const arena = { ...INITIAL_ARENA, bugs: { [LAST_MACHINE.id]: 0 } };

    expect(activateDebtEncounter('inactive', arena, [LAST_MACHINE])).toBe('appearing');
  });

  it('ignora registros ajenos al decidir si todas las máquinas de esta arena están reparadas', () => {
    const arena = repairedArena();
    const withUnrelated = { ...arena, bugs: { ...arena.bugs, unrelated: 3 } };

    expect(activateDebtEncounter('inactive', withUnrelated, MACHINES)).toBe('appearing');
  });

  it('espera al impacto de la última corrección y activa en ese mismo paso de simulación', () => {
    const arena = repairedArena();
    const pending: ArenaState = {
      ...arena,
      bugs: { ...arena.bugs, [LAST_MACHINE.id]: 1 },
      agents: [{
        targetId: LAST_MACHINE.id,
        position: { x: LAST_MACHINE.position.x - 1, z: LAST_MACHINE.position.z },
      }],
    };

    const travelling = stepArena(pending, MACHINES, PLAYER, 1, 0.01).state;
    expect(travelling.bugs[LAST_MACHINE.id]).toBe(1);
    expect(activateDebtEncounter('inactive', travelling, MACHINES)).toBe('inactive');

    const impact = stepArena(travelling, MACHINES, PLAYER, 1.1, 0.1).state;
    expect(impact.bugs[LAST_MACHINE.id]).toBe(0);
    expect(activateDebtEncounter('inactive', impact, MACHINES)).toBe('appearing');
  });

  it('conserva la aparición en los pasos siguientes sin volver a iniciar el encuentro', () => {
    const arena = repairedArena();
    let phase = activateDebtEncounter('inactive', arena, MACHINES);

    for (let frame = 0; frame < 10; frame++) {
      phase = activateDebtEncounter(phase, arena, MACHINES);
      expect(phase).toBe('appearing');
    }
  });

  for (const phase of [
    'appearing',
    'approaching',
    'telegraphing',
    'attacking',
    'recovering',
    'defeated',
    'player-defeated',
  ] as const) {
    it(`conserva la fase ${phase} aunque las máquinas sigan completas`, () => {
      expect(activateDebtEncounter(phase, repairedArena(), MACHINES)).toBe(phase);
    });

    it(`no retrocede desde ${phase} si recibe una arena con máquinas pendientes`, () => {
      expect(activateDebtEncounter(phase, INITIAL_ARENA, MACHINES)).toBe(phase);
    });
  }

  it('consulta el progreso sin modificar bugs, proyectiles ni correcciones de la arena', () => {
    const arena: ArenaState = {
      ...repairedArena(),
      bullets: [{ position: { x: 1, z: 2 }, velocity: { x: 3, z: 0 }, ttl: 2 }],
      agents: [{ position: { x: 0, z: 0 }, targetId: LAST_MACHINE.id }],
      lastShot: { [LAST_MACHINE.id]: 1 },
    };
    const before = structuredClone(arena);

    activateDebtEncounter('inactive', arena, MACHINES);

    expect(arena).toEqual(before);
  });
});
