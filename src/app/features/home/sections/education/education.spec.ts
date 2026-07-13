import { TestBed } from '@angular/core/testing';
import { EducationEntry } from '../../../../core/content/education-entry';
import { Education } from './education';

const ENTRIES: EducationEntry[] = [
  {
    institution: 'Universidad Isabel I',
    degree: 'Máster en Desarrollo con IA',
    period: '2026 — actualidad',
    location: 'España · Online',
  },
  {
    institution: 'UNAD Colombia',
    degree: 'Ingeniería de Sistemas',
    period: '2016 — 2019',
    location: 'Colombia',
  },
];

describe('Education', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ imports: [Education] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  const COURSES = ['Scrum Master — UniversiK', 'ITIL 4 — UniversiK'];

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(Education);
    fixture.componentRef.setInput('entries', ENTRIES);
    fixture.componentRef.setInput('courses', COURSES);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  // R28 — formación: institución, título y periodo
  it('renders every degree with institution, title and period (R28)', () => {
    const host = render();
    const degrees = host.querySelectorAll('.degree');
    expect(degrees.length).toBe(2);
    expect(host.textContent).toContain('Máster en Desarrollo con IA');
    expect(host.textContent).toContain('Universidad Isabel I');
    expect(host.textContent).toContain('Ingeniería de Sistemas');
    expect(host.textContent).toContain('2016 — 2019');
  });

  // R37 — cursos complementarios del CV como piezas compactas
  it('lists the complementary courses (R37)', () => {
    const host = render();
    const courses = Array.from(host.querySelectorAll('.courses__item')).map((c) =>
      c.textContent?.trim(),
    );
    expect(courses).toEqual(COURSES);
  });

  it('reveals each degree on scroll (R16)', () => {
    render()
      .querySelectorAll('.degree')
      .forEach((item) => expect(item.classList.contains('reveal')).toBeTrue());
  });
});
