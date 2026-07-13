import { Language } from '../i18n/language.model';

export function profileContentUrl(language: Language): string {
  return `content/profile.${language}.json`;
}
