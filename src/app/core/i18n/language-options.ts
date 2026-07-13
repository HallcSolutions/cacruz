import { Language } from './language.model';

export const SUPPORTED_LANGUAGES: readonly Language[] = ['es', 'en'];

export const DEFAULT_LANGUAGE: Language = 'es';

export function isLanguage(value: unknown): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}
