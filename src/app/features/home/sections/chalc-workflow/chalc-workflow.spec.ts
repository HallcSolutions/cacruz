import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { Home } from '../../home';

// Se monta Home: los criterios se prueban antes de crear la sección de implementación.
describe('Chalc workflow (professional-home)', () => {
  let fixture: ComponentFixture<Home>;
  let motion: { matches: boolean; addEventListener: jasmine.Spy; removeEventListener: jasmine.Spy };

  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    motion = { matches: false, addEventListener: jasmine.createSpy(), removeEventListener: jasmine.createSpy() };
    spyOn(window, 'matchMedia').and.returnValue(motion as unknown as MediaQueryList);
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render(): HTMLElement {
    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function click(host: HTMLElement, selector: string): void {
    const control = host.querySelector<HTMLButtonElement>(selector);
    expect(control).withContext(selector).toBeTruthy();
    control?.click();
    fixture.detectChanges();
  }

  function active(host: HTMLElement): string | null {
    return host.querySelector('.workflow__step[aria-current="step"]')?.getAttribute('data-step') ?? null;
  }

  it('puts Chalc between the hero and three cases with seven directly selectable stages (R9)', () => {
    const host = render();
    const workflow = host.querySelector('app-chalc-workflow');
    expect(workflow).toBeTruthy();
    if (!workflow) return;
    expect(Boolean(host.querySelector('app-hero')!.compareDocumentPosition(workflow) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTrue();
    expect(Boolean(workflow.compareDocumentPosition(host.querySelector('#selected-work')!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTrue();
    expect(host.querySelectorAll('.workflow__step').length).toBe(7);
    expect(active(host)).toBe('context');
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(motion.addEventListener).toHaveBeenCalledWith('change', jasmine.any(Function));
    expect(workflow.querySelector('a')?.getAttribute('href')).toBe('https://github.com/ChristianCruzArango/chalc-cli-adapter');
    expect(workflow.textContent).toContain('Recorrido ilustrativo');
  });

  it('explains each stage with its artifact and condition to continue (R9)', () => {
    const host = render();
    const ids = ['context', 'spec', 'red', 'agents', 'gate', 'review', 'memory'];
    const artifacts = ['docs/architecture.md', 'spec.md', 'Red', 'diff', '.chalc/gate.md', '.chalc/review.md', 'memoria'];
    ids.forEach((id, index) => {
      click(host, `[data-step="${id}"]`);
      expect(active(host)).toBe(id);
      expect(host.querySelector('.workflow__artifact')?.textContent).toContain(artifacts[index]);
      expect(host.querySelector('.workflow__explanation')?.textContent?.trim()).toBeTruthy();
      expect(host.querySelector('.workflow__gate')?.textContent?.trim()).toBeTruthy();
    });
  });

  it('stays still until playback and advances once per six seconds; pause keeps the current stage (R10)', fakeAsync(() => {
    const host = render();
    tick(12000);
    expect(active(host)).toBe('context');
    click(host, '.workflow__play');
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('true');
    tick(5999); fixture.detectChanges();
    expect(active(host)).toBe('context');
    tick(1); fixture.detectChanges();
    expect(active(host)).toBe('spec');
    click(host, '.workflow__play');
    tick(12000); fixture.detectChanges();
    expect(active(host)).toBe('spec');
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('false');
    fixture.destroy();
  }));

  it('stops on manual selection, next or previous, and respects both ends (R10)', fakeAsync(() => {
    const host = render();
    expect(host.querySelector<HTMLButtonElement>('.workflow__previous')?.disabled).toBeTrue();
    click(host, '.workflow__play');
    click(host, '[data-step="agents"]');
    expect(active(host)).toBe('agents');
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('false');
    tick(12000); fixture.detectChanges();
    expect(active(host)).toBe('agents');
    click(host, '.workflow__play');
    click(host, '.workflow__next');
    expect(active(host)).toBe('gate');
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('false');
    click(host, '.workflow__previous');
    expect(active(host)).toBe('agents');
    click(host, '[data-step="memory"]');
    expect(host.querySelector<HTMLButtonElement>('.workflow__next')?.disabled).toBeTrue();
    fixture.destroy();
  }));

  it('stops at the last stage and explicitly replays from the beginning (R10)', fakeAsync(() => {
    const host = render();
    click(host, '.workflow__play');
    tick(36000); fixture.detectChanges();
    expect(active(host)).toBe('memory');
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('true');
    tick(6000); fixture.detectChanges();
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('false');
    tick(12000); fixture.detectChanges();
    expect(active(host)).toBe('memory');
    click(host, '.workflow__play');
    expect(active(host)).toBe('context');
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('true');
    fixture.destroy();
  }));

  it('keeps reduced-motion manual without a playback timer (R11)', fakeAsync(() => {
    motion.matches = true;
    const host = render();
    expect(host.querySelector<HTMLButtonElement>('.workflow__play')?.disabled).toBeTrue();
    click(host, '.workflow__play');
    tick(12000); fixture.detectChanges();
    expect(active(host)).toBe('context');
    click(host, '.workflow__next');
    expect(active(host)).toBe('spec');
    expect(host.querySelector('.workflow__motion-note')?.textContent).toContain('Recorrido manual');
    fixture.destroy();
  }));

  it('pauses when reduced motion is enabled and releases its listener on destroy (R11)', fakeAsync(() => {
    const host = render();
    click(host, '.workflow__play');
    const onChange = motion.addEventListener.calls.mostRecent()?.args[1] as ((event: MediaQueryListEvent) => void) | undefined;
    expect(onChange).toBeDefined();
    if (!onChange) { fixture.destroy(); return; }
    motion.matches = true;
    onChange({ matches: true } as MediaQueryListEvent);
    fixture.detectChanges();
    tick(12000); fixture.detectChanges();
    expect(active(host)).toBe('context');
    expect(host.querySelector('.workflow__play')?.getAttribute('aria-pressed')).toBe('false');
    fixture.destroy();
    expect(motion.removeEventListener).toHaveBeenCalledWith('change', onChange);
  }));

  it('translates the selected stage, controls and demonstration label without losing the stage (R12)', () => {
    const host = render();
    click(host, '[data-step="spec"]');
    TestBed.inject(TranslationService).setLanguage('en');
    fixture.detectChanges();
    expect(active(host)).toBe('spec');
    expect(host.querySelector('.workflow__title')?.textContent).toContain('Chalc');
    expect(host.querySelector('.workflow__demo')?.textContent).toContain('Illustrated walkthrough');
    expect(host.querySelector('.workflow__explanation')?.textContent).toContain('requirements');
    expect(host.querySelector('.workflow__gate')?.textContent).toContain('Approved');
    expect(host.querySelector('.workflow__play')?.textContent).toContain('Play');
    expect(host.querySelector('.workflow__previous')?.textContent).toContain('Previous');
    expect(host.querySelector('.workflow__next')?.textContent).toContain('Next');
  });
  it('introduces Christian as the creator and exposes the hero destination (R2, R9)', () => {
    const host = render();
    expect(host.querySelector('#chalc-workflow')).toBeTruthy();
    expect(host.querySelector('.workflow__intro')?.textContent).toContain('Creé Chalc');
    TestBed.inject(TranslationService).setLanguage('en'); fixture.detectChanges();
    expect(host.querySelector('.workflow__intro')?.textContent).toContain('I created Chalc');
  });
});
