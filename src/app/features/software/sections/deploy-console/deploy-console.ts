import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { buildDeployScript, DEPLOY_LINE_TICK_MS } from '../../deploy-script';
import { Product } from '../../product';
import { OFFLINE_STATE, ServiceState } from './service-state';

@Component({
  selector: 'app-deploy-console',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './deploy-console.html',
  styleUrl: './deploy-console.css',
})
export class DeployConsole {
  readonly products = input.required<Product[]>();

  /** Estado por producto; el juego consiste en llevarlos todos a "online". */
  private readonly states = signal<Record<string, ServiceState>>({});

  protected readonly onlineCount = computed(
    () => Object.values(this.states()).filter((state) => state.status === 'online').length,
  );

  protected readonly allOnline = computed(
    () => this.products().length > 0 && this.onlineCount() === this.products().length,
  );

  private timers: ReturnType<typeof setInterval>[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.timers.forEach(clearInterval));
  }

  protected stateOf(id: string): ServiceState {
    return this.states()[id] ?? OFFLINE_STATE;
  }

  /** Pliega o reabre el detalle de un servicio en línea, sin apagarlo (R69). */
  protected toggle(product: Product): void {
    const state = this.stateOf(product.id);
    if (state.status === 'online') {
      this.patch(product.id, { ...state, collapsed: !state.collapsed });
    }
  }

  protected deploy(product: Product): void {
    if (this.stateOf(product.id).status !== 'offline') {
      return;
    }

    const script = buildDeployScript(product);
    this.patch(product.id, { status: 'deploying', lines: [script[0]], collapsed: false });

    let next = 1;
    const timer = setInterval(() => {
      if (next < script.length) {
        const state = this.stateOf(product.id);
        this.patch(product.id, { ...state, lines: [...state.lines, script[next]] });
        next++;
        return;
      }
      clearInterval(timer);
      this.patch(product.id, { ...this.stateOf(product.id), status: 'online' });
    }, DEPLOY_LINE_TICK_MS);
    this.timers.push(timer);
  }

  private patch(id: string, state: ServiceState): void {
    this.states.update((all) => ({ ...all, [id]: state }));
  }
}
