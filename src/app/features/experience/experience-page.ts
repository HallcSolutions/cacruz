import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileContentService } from '../../core/content/profile-content.service';
import { ExperienceTimeline } from './sections/timeline/timeline';

@Component({
  selector: 'app-experience-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ExperienceTimeline],
  templateUrl: './experience-page.html',
  styleUrl: './experience-page.css',
})
export class ExperiencePage {
  protected readonly profile = inject(ProfileContentService);
}
