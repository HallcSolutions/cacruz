import { TestBed } from '@angular/core/testing';
import { Project } from '../../../../core/content/project';
import { ProjectList } from './project-list';

const PROJECTS: Project[] = [
  {
    name: 'cc-form-engine',
    description: 'Librería de formularios.',
    language: 'TypeScript',
    imageUrl: 'images/projects/cc-form-engine.svg',
    repoUrl: 'https://github.com/ChristianCruzArango/cc-form-engine',
  },
  {
    name: 'cacode',
    description: 'Revisor con IA.',
    language: 'TypeScript',
    imageUrl: 'images/projects/cacode.svg',
    repoUrl: 'https://github.com/ChristianCruzArango/cacode',
  },
];

const GITHUB_URL = 'https://github.com/ChristianCruzArango?tab=repositories';

describe('ProjectList', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ imports: [ProjectList] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render() {
    const fixture = TestBed.createComponent(ProjectList);
    fixture.componentRef.setInput('projects', PROJECTS);
    fixture.componentRef.setInput('githubProfileUrl', GITHUB_URL);
    fixture.detectChanges();
    return fixture;
  }

  // R6 — nombre, descripción, lenguaje, imagen y enlace por proyecto
  it('renders each project with name, description, language, image and repo link (R6)', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.textContent).toContain('cc-form-engine');
    expect(host.textContent).toContain('Librería de formularios.');
    expect(host.textContent).toContain('TypeScript');
    const images = Array.from(host.querySelectorAll('img'));
    expect(images.map((i) => i.getAttribute('src'))).toContain('images/projects/cacode.svg');
    const links = Array.from(host.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain('https://github.com/ChristianCruzArango/cc-form-engine');
  });

  // R6 — layout editorial alternado, sin cards
  it('alternates the editorial layout row by row (R6)', () => {
    const rows = (render().nativeElement as HTMLElement).querySelectorAll('.project');
    expect(rows.length).toBe(2);
    expect(rows[0].classList.contains('project--flip')).toBeFalse();
    expect(rows[1].classList.contains('project--flip')).toBeTrue();
  });

  // R27 — numeración editorial integrada al texto
  it('numbers every project editorially (R27)', () => {
    const indexes = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('.project__number'),
    ).map((el) => el.textContent?.trim());
    expect(indexes).toEqual(['01', '02']);
  });

  // R27 — barrido de brillo presente en el arte
  it('adds the shine sweep layer to every project art (R27)', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelectorAll('.project__shine').length).toBe(2);
  });

  // R7 — enlace al perfil completo
  it('links to the full GitHub profile (R7)', () => {
    const links = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('a'),
    ).map((a) => a.getAttribute('href'));
    expect(links).toContain(GITHUB_URL);
  });

  // R8 — imagen rota → reemplazo visual sin romper el layout
  it('swaps a broken image for a visual placeholder (R8)', () => {
    const fixture = render();
    const host = fixture.nativeElement as HTMLElement;
    const image = host.querySelector('img')!;
    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(host.querySelectorAll('img').length).toBe(1);
    expect(host.querySelectorAll('.project__placeholder').length).toBe(1);
  });
});
