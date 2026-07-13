import { Language } from '../../../core/i18n/language.model';

const DATE_LOCALES: Record<Language, string> = { es: 'es-CO', en: 'en-US' };

export function formatPostDate(isoDate: string, language: Language): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat(DATE_LOCALES[language], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
