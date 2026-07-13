import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SUPPORTED_LANGUAGES } from '../../../core/i18n/language-options';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  protected readonly i18n = inject(TranslationService);
  protected readonly languages = SUPPORTED_LANGUAGES;
}
