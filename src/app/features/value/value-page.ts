import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslationService } from '../../core/i18n/translation.service';
import { ContactModal } from '../../shared/components/contact-modal/contact-modal';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import {
  INITIAL_TYPEWRITER_STATE,
  nextTypewriterState,
  TYPEWRITER_TICK_MS,
  typewriterText,
} from '../../shared/utils/typewriter';
import { VALUE_ITEMS, VALUE_STATS } from './value-items';

@Component({
  selector: 'app-value-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective, ContactModal],
  templateUrl: './value-page.html',
  styleUrl: './value-page.css',
})
export class ValuePage {
  private readonly i18n = inject(TranslationService);

  protected readonly items = VALUE_ITEMS;
  protected readonly stats = VALUE_STATS;
  protected readonly contactOpen = signal(false);

  /** Texto del CTA, reactivo al idioma; se teclea en vivo como en el inicio. */
  private readonly ctaText = computed(() => this.i18n.t('value.cta.email'));
  protected readonly typedCta = signal('');

  constructor() {
    let state = INITIAL_TYPEWRITER_STATE;
    const intervalId = setInterval(() => {
      const words = [this.ctaText()];
      state = nextTypewriterState(words, state);
      this.typedCta.set(typewriterText(words, state));
    }, TYPEWRITER_TICK_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(intervalId));
  }

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
