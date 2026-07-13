import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EducationEntry } from '../../../../core/content/education-entry';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  readonly entries = input.required<EducationEntry[]>();
  readonly courses = input.required<string[]>();
}
