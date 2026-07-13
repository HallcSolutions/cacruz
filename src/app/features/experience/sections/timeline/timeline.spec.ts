import { TestBed } from '@angular/core/testing';
import { ExperienceEntry } from '../../../../core/content/experience-entry';
import { ExperienceTimeline } from './timeline';

const ENTRIES: ExperienceEntry[] = [
  {
    company: 'Think Us',
    role: 'Senior Full-Stack Developer',
    period: '2025 — actualidad',
    location: 'Remoto',
    summary: 'Angular y .NET con IA.',
  },
  {
    company: 'Indra',
    role: 'Software Engineer 3',
    period: '2022 — 2024',
    location: 'Remoto',
    summary: 'Frontend escalable.',
  },
  {
    company: 'LEGIS',
    role: 'Support Engineer',
    period: '2016 — 2017',
    location: 'Colombia',
    summary: 'SQL y soporte.',
  },
];

describe('ExperienceTimeline', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ imports: [ExperienceTimeline] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(ExperienceTimeline);
    fixture.componentRef.setInput('entries', ENTRIES);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  // R3 — línea de tiempo con empresa, rol, periodo y resumen
  it('renders one timeline item per entry with its details (R3)', () => {
    const items = render().querySelectorAll('li');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Think Us');
    expect(items[0].textContent).toContain('Senior Full-Stack Developer');
    expect(items[0].textContent).toContain('2025 — actualidad');
    expect(items[0].textContent).toContain('Angular y .NET con IA.');
  });

  // R4 — cada elemento se revela al entrar al viewport
  it('attaches the reveal behavior to every timeline item (R4)', () => {
    render()
      .querySelectorAll('li')
      .forEach((item) => expect(item.classList.contains('reveal')).toBeTrue());
  });

  // R25 — serpentina: los items alternan de lado
  it('alternates items on both sides of the central line (R25)', () => {
    const items = render().querySelectorAll('li');
    expect(items[0].classList.contains('timeline__item--flip')).toBeFalse();
    expect(items[1].classList.contains('timeline__item--flip')).toBeTrue();
    expect(items[2].classList.contains('timeline__item--flip')).toBeFalse();
  });
});
