import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, RingGeometry } from 'three';
import { DebtEncounterState } from '../model/debt-encounter-state';
import { Vector2 } from '../model/vector2';
import { DEBT_ATTACK_RADIUS } from '../logic/debt-encounter';
import { buildDebtMonster } from './build-debt-monster';
import { disposeModel } from './dispose-model';

/** Presentación del encuentro: el estado puro determina daño, vida y fases. */
export class DebtMonsterView {
  readonly root = new Group();
  private readonly model = buildDebtMonster();
  private readonly warning = new Group();
  private readonly torso = this.model.getObjectByName('torso')!;
  private readonly leftArm = this.model.getObjectByName('left-shoulder')!;
  private readonly rightArm = this.model.getObjectByName('right-shoulder')!;
  private collapse = 0;
  private readonly lanes = new Group();

  constructor() {
    const material = new MeshBasicMaterial({ color: 0xffab35, transparent: true, opacity: 0.85, depthWrite: false });
    const geometry = new RingGeometry(DEBT_ATTACK_RADIUS - 0.09, DEBT_ATTACK_RADIUS, 6, 1, 0, Math.PI / 15);
    for (let i = 0; i < 24; i++) {
      const segment = new Mesh(geometry, material);
      segment.rotation.x = -Math.PI / 2;
      segment.rotation.z = i * Math.PI / 12;
      segment.position.y = 0.035;
      this.warning.add(segment);
    }
    const laneMaterial = new MeshBasicMaterial({ color: 0xff633e, transparent: true, opacity: 0.32, depthWrite: false });
    for (const angle of [-0.42, -0.21, 0, 0.21, 0.42]) {
      const ray = new Group();
      ray.rotation.y = angle;
      const stripe = new Mesh(new PlaneGeometry(0.13, 12), laneMaterial);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.045, 8.9);
      ray.add(stripe);
      this.lanes.add(ray);
    }
    this.root.add(this.model, this.warning, this.lanes);
    this.root.visible = false;
  }

  update(state: DebtEncounterState, player: Vector2, elapsed: number, delta: number): void {
    this.root.visible = state.phase !== 'inactive';
    if (!this.root.visible) return;
    this.root.position.set(state.position.x, 0, state.position.z);
    const dead = state.phase === 'defeated';
    this.collapse = Math.max(0, Math.min(1, this.collapse + (dead ? delta : -delta * 5)));
    this.model.rotation.x = -this.collapse * 1.35;
    this.model.position.y = -this.collapse * 0.35;
    if (!dead && state.phase !== 'attacking') this.model.rotation.y = Math.atan2(player.x - state.position.x, player.z - state.position.z);
    const appearing = state.phase === 'appearing';
    const scale = appearing ? Math.max(0.05, 1 - state.remaining / 1.6) : 1;
    this.model.scale.setScalar(scale);
    const windup = state.phase === 'telegraphing';
    const slam = state.phase === 'attacking';
    this.torso.position.y = 2.75 + (slam ? -0.28 : Math.sin(elapsed * 1.7) * 0.035);
    this.leftArm.rotation.x = windup ? -1.55 : slam ? -0.5 : Math.sin(elapsed * 1.7) * 0.06;
    this.rightArm.rotation.x = windup ? -1.8 : slam ? -0.7 : -Math.sin(elapsed * 1.7) * 0.06;
    this.lanes.visible = windup;
    if (state.aim) this.lanes.rotation.y = Math.atan2(state.aim.x - state.position.x, state.aim.z - state.position.z);
    this.warning.visible = windup || slam || appearing;
    this.warning.scale.setScalar(slam ? 1.05 : 1);
  }

  dispose(): void {
    disposeModel(this.root);
  }
}
