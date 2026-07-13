import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExperienceEntry } from '../../../../core/content/experience-entry';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-experience-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
})
export class ExperienceTimeline {
  readonly entries = input.required<ExperienceEntry[]>();
}
