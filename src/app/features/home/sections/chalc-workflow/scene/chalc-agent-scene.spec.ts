import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslationService } from '../../../../../core/i18n/translation.service';
import { Home } from '../../../home';

describe('Illustrated Chalc agent scene (professional-home)', () => {
  let fixture: ComponentFixture<Home>;
  let motion: { matches: boolean; addEventListener: jasmine.Spy; removeEventListener: jasmine.Spy };

  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    motion = { matches: false, addEventListener: jasmine.createSpy(), removeEventListener: jasmine.createSpy() };
    spyOn(window, 'matchMedia').and.returnValue(motion as unknown as MediaQueryList);
    TestBed.configureTestingModule({ imports: [Home], providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render(): HTMLElement {
    fixture = TestBed.createComponent(Home); fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function click(host: HTMLElement, selector: string): void {
    const button = host.querySelector<HTMLButtonElement>(selector);
    expect(button).withContext(selector).toBeTruthy(); button?.click(); fixture.detectChanges();
  }

  it('shows the three own characters and selects the matching working agent and deliverable (R14)', () => {
    const host = render();
    expect(host.querySelectorAll('.scene__role').length).toBe(3);
    click(host, '[data-role="leader"]');
    expect(host.querySelector('.scene')?.getAttribute('data-active-agent')).toBe('leader');
    expect(host.querySelector('.scene__working-agent svg')).toBeTruthy();
    expect(host.querySelector('.scene__purpose')?.textContent).toContain('especificación');
    expect(host.querySelector('.scene__input')?.textContent).toContain('Necesidad');
    expect(host.querySelector('.scene__output')?.textContent).toContain('Especificación');
    expect(host.querySelector('.scene__document--incoming')?.textContent).toContain('Necesidad');
    expect(host.querySelector('.scene__document--outgoing')?.textContent).toContain('Especificación');
    expect(getComputedStyle(host.querySelector('.scene__document--incoming')!).animationName).toBe('none');
    click(host, '[data-role="developer"]');
    expect(host.querySelector('.scene')?.getAttribute('data-active-agent')).toBe('developer');
    expect(host.querySelector('.scene__output')?.textContent).toContain('Cambio');
    expect(host.querySelector('.workflow__artifact')?.textContent).toContain('diff');
    click(host, '[data-role="reviewer"]');
    expect(host.querySelector('.scene')?.getAttribute('data-active-agent')).toBe('reviewer');
    expect(host.querySelector('.workflow__artifact')?.textContent).toContain('.chalc/review.md');
  });

  it('returns the finding to the developer and explains correction and rechecking with OWASP evidence (R15, R18)', () => {
    const host = render(); click(host, '[data-role="reviewer"]');
    expect(host.querySelector('.scene__return')?.getAttribute('data-destination')).toBe('developer');
    expect(host.querySelector('.scene__return')?.textContent).toContain('Hallazgo');
    expect(host.querySelector('.scene__handoff')?.textContent).toContain('desarrollador');
    expect(host.querySelector('.scene__handoff')?.textContent).toContain('comprobar');
    expect(host.querySelector('.scene__purpose')?.textContent).toContain('OWASP Top 10');
    expect(host.querySelector('.scene__handoff')?.textContent).toContain('documentan');
    expect(host.querySelector('.scene__handoff')?.textContent).toContain('evidencia');
    expect(host.querySelector('.scene__handoff')?.textContent).toContain('aprobación humana');
    expect(host.querySelector('.scene__recheck')).toBeTruthy();
    expect(host.querySelector('.scene__correction')).toBeTruthy();
    expect(host.querySelector('.scene__review-developer svg')).toBeTruthy();
  });

  it('makes the quality tools and human destination distinct from agents, including OWASP (R16, R18)', () => {
    const host = render(); click(host, '.workflow__step[data-step="gate"]');
    const checks = host.querySelector('.scene__checks')?.textContent;
    expect(checks).toContain('Pruebas'); expect(checks).toContain('Mutation');
    expect(checks).toContain('OWASP Top 10');
    expect(checks).toContain('análisis disponible');
    expect(checks).toContain('Duplicación'); expect(checks).toContain('Arquitectura'); expect(checks).toContain('Seguridad');
    expect(host.querySelector('.scene__tools')?.textContent).toContain('Herramientas deterministas');
    expect(host.querySelector('.scene__tools')?.textContent).toContain('Asesor');
    expect(host.querySelector('.scene')?.getAttribute('data-active-agent')).toBe('tool');
    click(host, '.workflow__step[data-step="memory"]');
    expect(host.querySelector('.scene__human')).toBeTruthy();
    expect(host.querySelector('.scene__input')?.textContent).toContain('Evidencia');
    expect(host.querySelector('.scene__output')?.textContent).toContain('Memoria');
    expect(host.querySelector('.workflow__demo')?.textContent).toContain('Recorrido ilustrativo');
  });

  it('runs and pauses object motion together with the only playback clock (R17)', fakeAsync(() => {
    const host = render(); click(host, '[data-role="leader"]');
    expect(host.querySelector<HTMLElement>('.scene')?.style.animationPlayState).toBe('paused');
    click(host, '.workflow__play');
    expect(host.querySelector<HTMLElement>('.scene')?.style.animationPlayState).toBe('running');
    expect(getComputedStyle(host.querySelector('.scene__document')!).animationPlayState).toBe('running');
    expect(getComputedStyle(host.querySelector('.scene__working-agent .agent__arm')!).animationPlayState).toBe('running');
    expect(getComputedStyle(host.querySelector('.scene__performer')!).animationPlayState).toBe('running');
    expect(getComputedStyle(host.querySelector('.scene__performer')!).animationName).not.toBe('none');
    click(host, '.workflow__play');
    expect(host.querySelector<HTMLElement>('.scene')?.style.animationPlayState).toBe('paused');
    expect(getComputedStyle(host.querySelector('.scene__document')!).animationPlayState).toBe('paused');
    expect(getComputedStyle(host.querySelector('.scene__working-agent .agent__arm')!).animationPlayState).toBe('paused');
    expect(getComputedStyle(host.querySelector('.scene__performer')!).animationPlayState).toBe('paused');
    expect(getComputedStyle(host.querySelector('.scene__performer')!).animationName).not.toBe('none');
    expect(getComputedStyle(host.querySelector('.scene__document')!).animationName).not.toBe('none');
    tick(12000); fixture.detectChanges();
    expect(host.querySelector('.workflow__step[aria-current="step"]')?.getAttribute('data-step')).toBe('spec');
    click(host, '.workflow__play'); click(host, '[data-role="reviewer"]');
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('false');
    expect(host.querySelector<HTMLElement>('.scene')?.style.animationPlayState).toBe('paused');
    expect(host.querySelectorAll('.workflow__play').length).toBe(1);
    fixture.destroy();
  }));

  it('keeps a static readable scene and manual selection with reduced motion (R17)', fakeAsync(() => {
    motion.matches = true; const host = render(); click(host, '[data-role="developer"]');
    expect(host.querySelector('.scene')?.getAttribute('data-reduced-motion')).toBe('true');
    expect(host.querySelector<HTMLElement>('.scene')?.style.animationPlayState).toBe('paused');
    const document = host.querySelector<HTMLElement>('.scene__document');
    expect(document).toBeTruthy();
    if (document) expect(getComputedStyle(document).animationName).toBe('none');
    expect(host.querySelector('.scene__working-agent svg')).toBeTruthy();
    expect(host.querySelector('.scene__input')?.textContent?.trim()).toBeTruthy();
    expect(host.querySelector('.scene__output')?.textContent?.trim()).toBeTruthy();
    tick(12000); fixture.detectChanges();
    expect(host.querySelector('.scene')?.getAttribute('data-active-agent')).toBe('developer');
    fixture.destroy();
  }));

  it('translates characters, narration and artifacts without losing the selected role, including OWASP (R17, R18)', () => {
    const host = render(); click(host, '[data-role="reviewer"]');
    TestBed.inject(TranslationService).setLanguage('en'); fixture.detectChanges();
    expect(host.querySelector('.scene')?.getAttribute('data-active-agent')).toBe('reviewer');
    expect(host.querySelector('[data-role="leader"]')?.textContent).toContain('Leader');
    expect(host.querySelector('[data-role="developer"]')?.textContent).toContain('Developer');
    expect(host.querySelector('[data-role="reviewer"]')?.textContent).toContain('Reviewer');
    expect(host.querySelector('.scene__purpose')?.textContent).toContain('requirements');
    expect(host.querySelector('.scene__purpose')?.textContent).toContain('OWASP Top 10');
    expect(host.querySelector('.scene__handoff')?.textContent).toContain('documented');
    expect(host.querySelector('.scene__handoff')?.textContent).toContain('human approval');
    expect(host.querySelector('.scene__return')?.textContent).toContain('Finding');
    expect(host.querySelector('.workflow__demo')?.textContent).toContain('Illustrated walkthrough');
    click(host, '.workflow__step[data-step="gate"]');
    expect(host.querySelector('.scene__checks')?.textContent).toContain('OWASP Top 10');
    expect(host.querySelector('.scene__checks')?.textContent).toContain('available analysis');
  });
});
