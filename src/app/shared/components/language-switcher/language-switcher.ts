import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { SUPPORTED_LANGUAGES } from '../../../core/i18n/language-options';
import { Language } from '../../../core/i18n/language.model';
import { TranslationService } from '../../../core/i18n/translation.service';
import { PrPhase } from './pr-phase';
import { CHECKS_MS, MERGED_MS } from './pr-timing';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  protected readonly i18n = inject(TranslationService);
  protected readonly languages = SUPPORTED_LANGUAGES;

  /** Fase visible del PR; el idioma ya cambió, esto es la animación. */
  protected readonly pr = signal<PrPhase>(null);

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimers());
  }

  protected select(language: Language): void {
    if (this.i18n.language() === language) {
      return;
    }
    // El cambio es inmediato; el flujo de PR es la capa visual que lo acompaña.
    this.i18n.setLanguage(language);
    this.runPullRequest();
  }

  private runPullRequest(): void {
    this.clearTimers();
    this.pr.set('checks');
    this.timers.push(setTimeout(() => this.pr.set('merged'), CHECKS_MS));
    this.timers.push(setTimeout(() => this.pr.set(null), MERGED_MS));
  }

  private clearTimers(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}
