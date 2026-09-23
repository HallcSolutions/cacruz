import { WorldZone } from './world-zone';
import { WorldCombatView } from './world-combat-view';

export interface WorldSceneOptions {
  readonly host: HTMLElement;
  readonly reducedMotion: boolean;
  readonly lowPower: boolean;
  readonly onZoneChange: (zone: WorldZone | null) => void;
  readonly onProgress?: (ratio: number) => void;
  readonly onHealth?: (hp: number) => void;
  readonly onHit?: () => void;
  readonly onCombat?: (view: WorldCombatView) => void;
}
