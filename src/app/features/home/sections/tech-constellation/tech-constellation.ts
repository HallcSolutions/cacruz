import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-tech-constellation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective],
  templateUrl: './tech-constellation.html',
  styleUrl: './tech-constellation.css',
})
export class TechConstellation {
  readonly items = input.required<string[]>();
}
