import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileContentService } from '../../core/content/profile-content.service';
import { ProjectList } from './sections/project-list/project-list';

@Component({
  selector: 'app-projects-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectList],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.css',
})
export class ProjectsPage {
  protected readonly profile = inject(ProfileContentService);
}
