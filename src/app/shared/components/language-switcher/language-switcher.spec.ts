import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../../../core/i18n/translation.service';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ imports: [LanguageSwitcher] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function createSwitcher() {
    const fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.detectChanges();
    return fixture;
  }

  function buttons(fixture: ReturnType<typeof createSwitcher>): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  it('renders one option per supported language (R13)', () => {
    const labels = buttons(createSwitcher()).map((b) => b.textContent?.trim().toLowerCase());
    expect(labels).toEqual(['es', 'en']);
  });

  it('marks the active language (R13)', () => {
    const active = buttons(createSwitcher()).filter(
      (b) => b.getAttribute('aria-pressed') === 'true',
    );
    expect(active.length).toBe(1);
    expect(active[0].textContent?.trim().toLowerCase()).toBe('es');
  });

  it('switches the language on click without reload (R13)', () => {
    const fixture = createSwitcher();
    const english = buttons(fixture).find((b) => b.textContent?.trim().toLowerCase() === 'en')!;
    english.click();
    fixture.detectChanges();
    expect(TestBed.inject(TranslationService).language()).toBe('en');
    expect(english.getAttribute('aria-pressed')).toBe('true');
  });
});
