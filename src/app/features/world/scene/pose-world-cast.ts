import { Group } from 'three';
import { poseThoughtBolt } from './build-thought-bolt';

/** Pose local: nunca modifica la posición que pertenece a la simulación física. */
export function poseDeveloper(root: Group, elapsed: number, speed: number, grounded: boolean, seated: boolean, power = 0): void {
  const moving = Math.min(speed / 4, 1);
  const stride = Math.sin(elapsed * 10) * moving * 0.65;
  const body = root.getObjectByName('body')!;
  body.position.y = seated ? 0.61 : 0.84;
  for (const side of ['left', 'right']) {
    const sign = side === 'left' ? 1 : -1;
    const leg = root.getObjectByName(`${side}-leg`)!;
    const knee = root.getObjectByName(`${side}-knee`)!;
    const foot = root.getObjectByName(`${side}-foot`)!;
    leg.rotation.x = seated ? -1.45 : !grounded ? -0.38 : stride * sign + (1 - moving) * sign * 0.27;
    leg.rotation.z = seated ? 0 : sign * 0.28 * (1 - moving);
    knee.rotation.x = seated ? 1.35 : !grounded ? 0.75 : Math.max(0, -stride * sign) * 0.8 + (1 - moving) * (side === 'left' ? 0.12 : 0.45);
    foot.quaternion.copy(leg.quaternion).multiply(knee.quaternion).invert();
    const arm = root.getObjectByName(`${side}-arm`)!;
    arm.rotation.x = -0.55;
    arm.rotation.z = sign * 0.08;
    root.getObjectByName(`${side}-elbow`)!.rotation.x = -1.2;
    root.getObjectByName(`${side}-hand`)!.rotation.set(1.75, 0, 0);
  }
  root.getObjectByName('head')!.rotation.x = 0.24 + power * 0.12;
  root.getObjectByName('reading-leaf')!.rotation.z = 0.18 + Math.sin(power * Math.PI) * 2.65;
  const insight = root.getObjectByName('book-insight')!;
  insight.visible = power > 0;
  poseThoughtBolt(insight, elapsed, false);
}

export function poseCompanion(root: Group, elapsed: number, speed: number): void {
  const stride = Math.sin(elapsed * 14) * Math.min(speed / 4, 1) * 0.55;
  for (const [name, sign] of [['front-left', 1], ['front-right', -1], ['back-left', -1], ['back-right', 1]] as const) {
    root.getObjectByName(name)!.rotation.x = stride * sign;
  }
  root.getObjectByName('tail')!.rotation.y = Math.sin(elapsed * 5) * 0.22;
}
