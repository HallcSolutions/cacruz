import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileContentService } from '../../core/content/profile-content.service';
import { TechCategory } from '../../core/content/tech-category';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ContactModal } from '../../shared/components/contact-modal/contact-modal';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { Education } from './sections/education/education';
import { Hero } from './sections/hero/hero';
import { TechConstellation } from './sections/tech-constellation/tech-constellation';

const CONSTELLATION_SIZE = 14;

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslatePipe,
    RevealOnScrollDirective,
    Hero,
    TechConstellation,
    Education,
    ContactModal,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly profile = inject(ProfileContentService);
  protected readonly contactOpen = signal(false);

  protected readonly highlights = computed(() =>
    interleaveByCategory(this.profile.content.value()?.tech ?? []).slice(0, CONSTELLATION_SIZE),
  );
}

/**
 * Recorre las categorías por rondas (una tecnología de cada una, luego la
 * siguiente de cada una), de modo que la constelación muestre un abanico —
 * frontend, backend, datos, IA/LLMs, DevOps— y no solo las primeras de una.
 */
function interleaveByCategory(categories: TechCategory[]): string[] {
  const rows = categories.map((category) => category.items);
  const depth = Math.max(0, ...rows.map((row) => row.length));
  const picked: string[] = [];
  for (let column = 0; column < depth; column++) {
    for (const row of rows) {
      if (column < row.length) {
        picked.push(row[column]);
      }
    }
  }
  return picked;
}
