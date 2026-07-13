import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.removeItem('cacruz.language');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // R13/R18/R29/R31 — navegación del shell con páginas propias y paths en inglés
  it('renders the navigation with home, experience, projects and logbook links', () => {
    const links = Array.from(render().querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain('/');
    expect(links).toContain('/experience');
    expect(links).toContain('/stack');
    expect(links).toContain('/projects');
    expect(links).toContain('/for-companies');
    expect(links).toContain('/daily');
  });

  // R13 — selector de idioma siempre visible
  it('shows the language switcher in the header', () => {
    expect(render().querySelector('app-language-switcher')).toBeTruthy();
  });

  // R57 — navegación responsive tras el botón de menú
  it('toggles the navigation panel with the menu button (R57)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const burger = host.querySelector<HTMLButtonElement>('.shell__burger')!;

    expect(burger.getAttribute('aria-expanded')).toBe('false');
    expect(host.querySelector('.shell__nav--open')).toBeNull();

    burger.click();
    fixture.detectChanges();
    expect(burger.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector('.shell__nav--open')).toBeTruthy();

    burger.click();
    fixture.detectChanges();
    expect(host.querySelector('.shell__nav--open')).toBeNull();
  });

  // R57 — al elegir un destino el panel se cierra
  it('closes the navigation panel after choosing a link (R57)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    host.querySelector<HTMLButtonElement>('.shell__burger')!.click();
    fixture.detectChanges();
    expect(host.querySelector('.shell__nav--open')).toBeTruthy();

    host.querySelector<HTMLAnchorElement>('.shell__nav a[href="/stack"]')!.click();
    fixture.detectChanges();
    expect(host.querySelector('.shell__nav--open')).toBeNull();
  });
});
