import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { DeployConsole } from './sections/deploy-console/deploy-console';
import { SoftwareContentService } from './software-content.service';

@Component({
  selector: 'app-software-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective, DeployConsole],
  templateUrl: './software-page.html',
  styleUrl: './software-page.css',
})
export class SoftwarePage {
  protected readonly content = inject(SoftwareContentService);
}
