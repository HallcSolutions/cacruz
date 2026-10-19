import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { ChalcAgentScene } from './scene/chalc-agent-scene';
import { CHALC_WORKFLOW_STEPS } from './chalc-workflow-steps';

const PLAYBACK_STEP_MS = 6000;

@Component({
  selector: 'app-chalc-workflow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, ChalcAgentScene],
  templateUrl: './chalc-workflow.html',
  styleUrl: './chalc-workflow.css',
})
export class ChalcWorkflow {
  protected readonly steps = CHALC_WORKFLOW_STEPS;
  protected readonly activeIndex = signal(0);
  protected readonly playing = signal(false);
  protected readonly activeStep = computed(() => this.steps[this.activeIndex()]);

  private readonly motionQuery = inject(DOCUMENT).defaultView?.matchMedia('(prefers-reduced-motion: reduce)');
  protected readonly reducedMotion = signal(this.motionQuery?.matches ?? false);
  private timer?: ReturnType<typeof setTimeout>;

  private readonly onMotionChange = (event: MediaQueryListEvent): void => {
    this.reducedMotion.set(event.matches);
    if (event.matches) this.pause();
  };

  constructor() {
    this.motionQuery?.addEventListener('change', this.onMotionChange);
    inject(DestroyRef).onDestroy(() => {
      this.pause();
      this.motionQuery?.removeEventListener('change', this.onMotionChange);
    });
  }

  protected selectStep(index: number): void {
    this.pause();
    this.activeIndex.set(index);
  }

  protected togglePlayback(): void {
    if (this.playing()) {
      this.pause();
      return;
    }
    if (this.reducedMotion()) return;
    if (this.activeIndex() === this.steps.length - 1) this.activeIndex.set(0);
    this.playing.set(true);
    this.scheduleAdvance();
  }

  private pause(): void {
    this.playing.set(false);
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private scheduleAdvance(): void {
    this.timer = setTimeout(() => {
      if (this.activeIndex() === this.steps.length - 1) {
        this.pause();
        return;
      }
      this.activeIndex.update((index) => index + 1);
      this.scheduleAdvance();
    }, PLAYBACK_STEP_MS);
  }
}
