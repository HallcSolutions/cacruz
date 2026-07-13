import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

const STORAGE_KEY = 'cacruz.language';

describe('TranslationService', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    TestBed.configureTestingModule({});
  });

  afterEach(() => localStorage.removeItem(STORAGE_KEY));

  // R15 — primer ingreso: español por defecto
  it('starts in Spanish when no language was persisted (R15)', () => {
    const service = TestBed.inject(TranslationService);
    expect(service.language()).toBe('es');
  });

  // R14 — recuerda el último idioma seleccionado
  it('restores the persisted language (R14)', () => {
    localStorage.setItem(STORAGE_KEY, 'en');
    const service = TestBed.inject(TranslationService);
    expect(service.language()).toBe('en');
  });

  it('falls back to Spanish when the persisted value is invalid (R15)', () => {
    localStorage.setItem(STORAGE_KEY, 'fr');
    const service = TestBed.inject(TranslationService);
    expect(service.language()).toBe('es');
  });

  it('persists the language on change (R14)', () => {
    const service = TestBed.inject(TranslationService);
    service.setLanguage('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
    expect(service.language()).toBe('en');
  });

  // R13 — traduce según el idioma activo, sin recarga
  it('translates a key in the active language and reacts to changes (R13)', () => {
    const service = TestBed.inject(TranslationService);
    expect(service.t('nav.home')).toBe('Inicio');
    service.setLanguage('en');
    expect(service.t('nav.home')).toBe('Home');
  });

  it('returns the key itself when no translation exists', () => {
    const service = TestBed.inject(TranslationService);
    expect(service.t('missing.key')).toBe('missing.key');
  });
});
