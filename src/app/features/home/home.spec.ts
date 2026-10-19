import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { TranslationService } from '../../core/i18n/translation.service';
import { ProfileContentService } from '../../core/content/profile-content.service';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  // R46 — el inicio cierra con una sección de contacto que abre el mismo modal
  it('closes the home page with a contact section (R46)', () => {
    expect(host().querySelector('.contact__title')?.textContent).toContain('Contáctame');
    expect(host().querySelector('.contact__cta')).toBeTruthy();
  });

  it('opens the contact modal from the home contact section (R46)', () => {
    expect(host().querySelector('app-contact-modal')).toBeNull();
    host().querySelector<HTMLButtonElement>('.contact__cta')!.click();
    fixture.detectChanges();
    expect(host().querySelector('app-contact-modal')).toBeTruthy();
  });
  it('opens one shared contact modal from the first block and closes it (professional-home R4)', () => {
    const button = host().querySelector<HTMLButtonElement>('.hero__contact-cta');
    expect(button).withContext('contact must be available in the first block').toBeTruthy();
    if (!button) return;
    expect(host().querySelector('app-contact-modal')).toBeNull();
    button.click();
    fixture.detectChanges();
    expect(host().querySelectorAll('app-contact-modal').length).toBe(1);
    host().querySelector<HTMLButtonElement>('.terminal__close')!.click();
    fixture.detectChanges();
    expect(host().querySelector('app-contact-modal')).toBeNull();
  });
  it('shows three inspectable cases before education without waiting for profile data (professional-home R3)', () => {
    const cases = Array.from(host().querySelectorAll('.work-case'));
    expect(cases.map((item) => item.querySelector('h3')?.textContent?.trim())).toEqual(['Chalc', 'RAG contratos', 'Cacode']);
    const repos = cases.map((item) => item.querySelector<HTMLAnchorElement>('a')?.getAttribute('href'));
    expect(repos).toEqual([
      'https://github.com/ChristianCruzArango/chalc-cli-adapter',
      'https://github.com/ChristianCruzArango/rag-contratos',
      'https://github.com/ChristianCruzArango/cacode',
    ]);
    expect(cases.every((item) => item.querySelector('.work-case__problem')?.textContent?.trim())).toBeTrue();
    expect(cases.every((item) => item.querySelector('.work-case__approach')?.textContent?.trim())).toBeTrue();
    expect(cases.every((item) => item.querySelector('.work-case__evidence')?.textContent?.trim())).toBeTrue();
    expect(host().querySelector('#selected-work')).toBeTruthy();
    expect(cases[0]?.textContent).toContain('Spec-Driven Development');
    expect(cases[1]?.textContent).toContain('documento, cláusula y página');
    expect(cases[2]?.textContent).toContain('reporte HTML');
  });

  it('translates all three cases and their evidence links (professional-home R6)', () => {
    TestBed.inject(TranslationService).setLanguage('en');
    fixture.detectChanges();
    const cases = Array.from(host().querySelectorAll('.work-case'));
    expect(cases.map((item) => item.querySelector('h3')?.textContent?.trim())).toEqual(['Chalc', 'Contract RAG', 'Cacode']);
    expect(cases[0]?.textContent).toContain('coding assistant');
    expect(cases[1]?.textContent).toContain('document, clause and page');
    expect(cases[2]?.textContent).toContain('HTML report');
    expect(cases.every((item) => item.querySelector('a')?.textContent?.includes('View repository'))).toBeTrue();
    expect(host().querySelector('#selected-work h2')?.textContent).toContain('Work you can explore');
  });
  it('places the evidence before the existing education content (professional-home R3)', () => {
    TestBed.inject(ProfileContentService).content.value.set({
      experience: [], education: [], courses: [], tech: [], projects: [], githubProfileUrl: '',
    });
    fixture.detectChanges();
    const work = host().querySelector('#selected-work');
    const education = host().querySelector('app-education');
    expect(work).toBeTruthy();
    expect(education).toBeTruthy();
    if (!work || !education) return;
    expect(Boolean(work.compareDocumentPosition(education) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTrue();
  });
  it('offers the optional game and translates its invitation (professional-home R5, R6)', () => {
    const link = host().querySelector<HTMLAnchorElement>('.world-invite__link');
    expect(link?.getAttribute('href')).toBe('/world');
    expect(link?.textContent).toContain('Explorar el mundo 3D');
    TestBed.inject(TranslationService).setLanguage('en');
    fixture.detectChanges();
    expect(host().querySelector('.world-invite__link')?.textContent).toContain('Explore the 3D world');
  });

  it('closes with a problem-focused contact invitation in both languages (professional-home R2, R6)', () => {
    expect(host().querySelector('.contact__body')?.textContent).toContain('Un proceso que mejorar');
    expect(host().textContent).not.toContain('vacante');
    TestBed.inject(TranslationService).setLanguage('en');
    fixture.detectChanges();
    expect(host().querySelector('.contact__body')?.textContent).toContain('A process to improve');
  });
});
