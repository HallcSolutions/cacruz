import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PRIVACY_POLICIES } from './content';
import { POLICY_LANGUAGES } from './policy-language';
import { PrivacyPage } from './privacy-page';

describe('PrivacyPage', () => {
  let fixture: ComponentFixture<PrivacyPage>;

  function render(lang: string): HTMLElement {
    TestBed.configureTestingModule({ imports: [PrivacyPage], providers: [provideRouter([])] });
    fixture = TestBed.createComponent(PrivacyPage);
    fixture.componentRef.setInput('lang', lang);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('shows the policy in the language of the URL', () => {
    const page = render('es');
    expect(page.querySelector('h1')?.textContent).toContain('Política de privacidad');
    expect(page.querySelector('article')?.getAttribute('lang')).toBe('es');
  });

  it('falls back to English for an unknown language', () => {
    const page = render('fr');
    expect(page.querySelector('h1')?.textContent).toContain('Privacy Policy');
    expect(page.querySelector('article')?.getAttribute('lang')).toBe('en');
  });

  it('renders every section of the selected policy', () => {
    const page = render('pt');
    const headings = Array.from(page.querySelectorAll('h2')).map((h) => h.textContent?.trim());
    expect(headings).toEqual(PRIVACY_POLICIES.pt.sections.map((s) => s.heading));
  });

  it('links to every language and marks the current one', () => {
    const page = render('en');
    const links = Array.from(page.querySelectorAll<HTMLAnchorElement>('nav a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(
      POLICY_LANGUAGES.map((lang) => `/chranta/privacy/${lang}`),
    );
    expect(page.querySelector('nav a[aria-current="page"]')?.getAttribute('hreflang')).toBe('en');
  });

  it('keeps the same sections in every language', () => {
    const counts = POLICY_LANGUAGES.map((lang) => PRIVACY_POLICIES[lang].sections.length);
    expect(new Set(counts).size).toBe(1);
  });

  it('states in every language that no data reaches a third-party AI service', () => {
    for (const lang of POLICY_LANGUAGES) {
      const text = JSON.stringify(PRIVACY_POLICIES[lang]);
      expect(text).toContain('Qwen3-0.6B');
    }
  });
});
