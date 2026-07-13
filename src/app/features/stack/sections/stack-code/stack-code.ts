import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TechCategory } from '../../../../core/content/tech-category';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { buildStackLines } from './build-stack-lines';

@Component({
  selector: 'app-stack-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective],
  templateUrl: './stack-code.html',
  styleUrl: './stack-code.css',
})
export class StackCode {
  readonly categories = input.required<TechCategory[]>();

  protected readonly lines = computed(() => buildStackLines(this.categories()));
}
