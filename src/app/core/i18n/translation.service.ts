import { Injectable, signal } from '@angular/core';
import { DEFAULT_LANGUAGE, isLanguage } from './language-options';
import { Language } from './language.model';
import { TRANSLATIONS } from './translations';

const STORAGE_KEY = 'cacruz.language';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly activeLanguage = signal<Language>(restoreLanguage());

  readonly language = this.activeLanguage.asReadonly();

  setLanguage(language: Language): void {
    this.activeLanguage.set(language);
    localStorage.setItem(STORAGE_KEY, language);
  }

  t(key: string): string {
    return TRANSLATIONS[this.activeLanguage()][key] ?? key;
  }
}

function restoreLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
}
