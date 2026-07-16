import { Language } from '../i18n/language.model';
import { withContentVersion } from './content-version';

export function profileContentUrl(language: Language): string {
  return withContentVersion(`content/profile.${language}.json`);
}
