import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileContentService } from '../../core/content/profile-content.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { BuildPipeline } from './sections/build-pipeline/build-pipeline';

@Component({
  selector: 'app-education-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective, BuildPipeline],
  templateUrl: './education-page.html',
  styleUrl: './education-page.css',
})
export class EducationPage {
  protected readonly profile = inject(ProfileContentService);
}
