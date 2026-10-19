import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileContentService } from '../../core/content/profile-content.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ContactModal } from '../../shared/components/contact-modal/contact-modal';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { pickConstellationHighlights } from './constellation-highlights';
import { FEATURED_CASES } from './featured-cases';
import { ChalcWorkflow } from './sections/chalc-workflow/chalc-workflow';
import { Education } from './sections/education/education';
import { Hero } from './sections/hero/hero';
import { TechConstellation } from './sections/tech-constellation/tech-constellation';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslatePipe,
    RevealOnScrollDirective,
    Hero,
    ChalcWorkflow,
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
  protected readonly cases = FEATURED_CASES;

  protected readonly highlights = computed(() =>
    pickConstellationHighlights(this.profile.content.value()?.tech ?? []),
  );
}
