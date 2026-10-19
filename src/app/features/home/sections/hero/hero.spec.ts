import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { CONTACT_EMAIL, GITHUB_PROFILE_URL, LINKEDIN_PROFILE_URL } from './hero-links';
import { Hero } from './hero';

describe('Professional Hero', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ imports: [Hero] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render() {
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    return fixture;
  }

  it('explains AI software engineering and identifies Christian immediately (professional-home R2)', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('h1')?.textContent).toContain('Ingeniería de software');
    expect(host.querySelector('h1')?.textContent).toContain('inteligencia artificial');
    expect(host.textContent).toContain('Christian Cruz Arango');
    expect(host.querySelector('.hero__summary')?.textContent).toContain('especificaciones, agentes y pruebas');
    expect(host.querySelector('h1')?.textContent).not.toContain('Full-Stack');
  });

  it('offers cases and contact before any interaction (professional-home R2, R4)', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector<HTMLAnchorElement>('.hero__work-cta')?.getAttribute('href')).toBe('#chalc-workflow');
    expect(host.querySelector<HTMLButtonElement>('.hero__contact-cta')?.textContent).toContain('Hablemos');
    expect(host.querySelector<HTMLAnchorElement>(`a[href="mailto:${CONTACT_EMAIL}"]`)).toBeTruthy();
    expect(host.querySelector<HTMLAnchorElement>(`a[href="${GITHUB_PROFILE_URL}"]`)).toBeTruthy();
    expect(host.querySelector<HTMLAnchorElement>(`a[href="${LINKEDIN_PROFILE_URL}"]`)).toBeTruthy();
  });

  it('translates the value proposition, methodology and actions (professional-home R6)', () => {
    const fixture = render();
    TestBed.inject(TranslationService).setLanguage('en');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h1')?.textContent).toContain('Software engineering');
    expect(host.querySelector('h1')?.textContent).toContain('artificial intelligence');
    expect(host.querySelector('.hero__summary')?.textContent).toContain('specifications, agents and tests');
    expect(host.querySelector('.hero__contact-cta')?.textContent).toContain('Let’s talk');
    expect(host.querySelector('.hero__work-cta')?.textContent).toContain('See how I work with AI');
    expect(host.querySelector('.hero__method')?.textContent).toContain('Specify');
    expect(host.querySelector('.hero__method')?.textContent).toContain('Verify');
  });
});
