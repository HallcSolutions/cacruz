import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileContentService } from '../../core/content/profile-content.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { StackCode } from './sections/stack-code/stack-code';

@Component({
  selector: 'app-stack-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective, StackCode],
  templateUrl: './stack-page.html',
  styleUrl: './stack-page.css',
})
export class StackPage {
  protected readonly profile = inject(ProfileContentService);
}
