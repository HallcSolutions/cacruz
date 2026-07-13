import { Language } from '../language.model';
import { EN_TRANSLATIONS } from './en';
import { ES_TRANSLATIONS } from './es';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  es: ES_TRANSLATIONS,
  en: EN_TRANSLATIONS,
};
