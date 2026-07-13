import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { TranslationService } from './translation.service';

describe('TranslatePipe', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({});
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  it('translates a key using the active language (R13)', () => {
    const pipe = TestBed.runInInjectionContext(() => new TranslatePipe());
    expect(pipe.transform('nav.blog')).toBe('Notas');
    expect(pipe.transform('nav.home')).toBe('Inicio');
  });

  it('reflects language changes without reload (R13)', () => {
    const pipe = TestBed.runInInjectionContext(() => new TranslatePipe());
    TestBed.inject(TranslationService).setLanguage('en');
    expect(pipe.transform('nav.home')).toBe('Home');
  });
});
