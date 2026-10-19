import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';
import { CHALC_AGENT_ROLES } from './chalc-agent-roles';
import { CHALC_AGENT_SCENES } from './chalc-agent-scenes';

@Component({
  selector: 'app-chalc-agent-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, NgTemplateOutlet],
  templateUrl: './chalc-agent-scene.html',
  styleUrl: './chalc-agent-scene.css',
})
export class ChalcAgentScene {
  readonly stepIndex = input.required<number>();
  readonly playing = input(false);
  readonly reducedMotion = input(false);
  readonly stageRequested = output<number>();

  protected readonly roles = CHALC_AGENT_ROLES;
  protected readonly scene = computed(() => CHALC_AGENT_SCENES[this.stepIndex()]);

  // Una pausa conserva el fotograma; una selección manual empieza como ilustración estática.
  protected readonly animationStarted = linkedSignal({
    source: () => ({ stage: this.stepIndex(), playing: this.playing() }),
    computation: (current, previous) =>
      current.playing || (previous?.source.stage === current.stage && previous.value) || false,
  });
}
