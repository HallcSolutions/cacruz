import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Project } from '../../../../core/content/project';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-project-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList {
  readonly projects = input.required<Project[]>();
  readonly githubProfileUrl = input.required<string>();

  protected readonly failedImages = signal<ReadonlySet<string>>(new Set());

  protected markImageAsFailed(projectName: string): void {
    this.failedImages.update((failed) => new Set(failed).add(projectName));
  }

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
