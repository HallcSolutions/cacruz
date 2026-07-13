import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ContactModal } from '../../shared/components/contact-modal/contact-modal';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { VALUE_ITEMS, VALUE_STATS } from './value-items';

const LINKEDIN_URL = 'https://www.linkedin.com/in/christian-alexis-cruz-arango/';
const GITHUB_URL = 'https://github.com/ChristianCruzArango';

@Component({
  selector: 'app-value-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective, ContactModal],
  templateUrl: './value-page.html',
  styleUrl: './value-page.css',
})
export class ValuePage {
  protected readonly items = VALUE_ITEMS;
  protected readonly stats = VALUE_STATS;
  protected readonly linkedinUrl = LINKEDIN_URL;
  protected readonly githubUrl = GITHUB_URL;
  protected readonly contactOpen = signal(false);

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
