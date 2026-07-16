import { withContentVersion } from '../../core/content/content-version';
import { Language } from '../../core/i18n/language.model';

export function softwareContentUrl(language: Language): string {
  return withContentVersion(`content/software.${language}.json`);
}
