import { TestBed } from '@angular/core/testing';
import {
  GITHUB_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
  YOUTUBE_PROFILE_URL,
} from './hero-links';
import { Hero } from './hero';

describe('Hero', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ imports: [Hero] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  // R1 — nombre, rol y enlaces visibles de inmediato
  it('shows the name and role (R1)', () => {
    const host = render();
    expect(host.textContent).toContain('Christian');
    expect(host.textContent).toContain('Cruz Arango');
    expect(host.textContent).toContain('Senior Full-Stack Developer');
  });

  it('links to GitHub, LinkedIn, YouTube and Instagram (R1)', () => {
    const links = Array.from(render().querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain(GITHUB_PROFILE_URL);
    expect(links).toContain(LINKEDIN_PROFILE_URL);
    expect(links).toContain(YOUTUBE_PROFILE_URL);
    expect(links).toContain(INSTAGRAM_PROFILE_URL);
  });

  // R2 — animación de entrada de alto impacto (hook de animación presente)
  it('stages the entry animation (R2)', () => {
    const staged = render().querySelectorAll('.hero-enter');
    expect(staged.length).toBeGreaterThanOrEqual(3);
  });

  // R19 — efecto máquina de escribir presente
  it('renders the typewriter slot with its caret (R19)', () => {
    const host = render();
    expect(host.querySelector('.hero__typed')).toBeTruthy();
    expect(host.querySelector('.hero__caret')).toBeTruthy();
  });

  // R22 — indicadores gráficos de trayectoria
  it('shows the trajectory stats as graphic pieces (R22)', () => {
    const stats = render().querySelectorAll('.stat');
    expect(stats.length).toBe(3);
  });

  // R34 — avatar como pieza central con anillos de apertura
  it('shows the avatar as the opening centerpiece (R34)', () => {
    const host = render();
    const avatar = host.querySelector<HTMLImageElement>('.hero__avatar');
    expect(avatar?.getAttribute('src')).toBe('images/avatar.png');
    expect(avatar?.getAttribute('alt')).toContain('Christian');
    expect(host.querySelectorAll('.hero__ring').length).toBe(2);
  });

  // R35 — terminal de desarrollador animada
  it('renders the developer terminal with its command lines (R35)', () => {
    const host = render();
    expect(host.querySelector('.terminal')).toBeTruthy();
    expect(host.querySelectorAll('.terminal__line').length).toBeGreaterThanOrEqual(3);
    expect(host.textContent).toContain('whoami');
  });
});
