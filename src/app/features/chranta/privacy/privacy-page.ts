import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIVACY_POLICIES } from './content';
import { isPolicyLanguage, POLICY_LANGUAGES, PolicyLanguage } from './policy-language';

/** Chranta's privacy policy in the language of the URL; English when unknown. */
@Component({
  selector: 'app-privacy-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './privacy-page.html',
  styleUrl: './privacy-page.css',
})
export class PrivacyPage {
  readonly lang = input<string>();

  protected readonly languages = POLICY_LANGUAGES;
  protected readonly policies = PRIVACY_POLICIES;
  protected readonly current = computed<PolicyLanguage>(() => {
    const lang = this.lang();
    return isPolicyLanguage(lang) ? lang : 'en';
  });
  protected readonly policy = computed(() => PRIVACY_POLICIES[this.current()]);
}
