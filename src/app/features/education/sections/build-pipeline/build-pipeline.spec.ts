import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EducationEntry } from '../../../../core/content/education-entry';
import { BuildPipeline } from './build-pipeline';

const ENTRIES: EducationEntry[] = [
  {
    institution: 'Universidad Isabel I',
    degree: 'Máster en Desarrollo con IA',
    period: 'En curso',
    location: 'España · Online',
  },
  {
    institution: 'UNAD Colombia',
    degree: 'Ingeniería de Sistemas',
    period: '2016 — 2019',
    location: 'Colombia',
  },
];

const COURSES = ['Scrum Master — UniversiK', 'ITIL 4 — UniversiK'];

/** Avanza el reloj lo suficiente para que cualquier job termine. */
const FULL_BUILD_MS = 10_000;

describe('BuildPipeline', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ imports: [BuildPipeline] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render() {
    const fixture = TestBed.createComponent(BuildPipeline);
    fixture.componentRef.setInput('entries', ENTRIES);
    fixture.componentRef.setInput('courses', COURSES);
    fixture.detectChanges();
    return fixture;
  }

  function host(fixture: ReturnType<typeof render>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function runFirstJob(fixture: ReturnType<typeof render>): void {
    host(fixture).querySelector<HTMLButtonElement>('.pipeline__run')!.click();
    fixture.detectChanges();
  }

  // R96 — jobs pendientes con institución, título y periodo; contador 0/N
  it('lists every degree as a pending job with the counter at zero (R96)', () => {
    const fixture = render();
    expect(host(fixture).querySelectorAll('.pipeline__job').length).toBe(2);
    expect(host(fixture).querySelectorAll('.pipeline__run').length).toBe(2);
    expect(host(fixture).querySelector('.pipeline__counter')?.textContent).toContain('0/2');
    expect(host(fixture).textContent).toContain('Máster en Desarrollo con IA');
    expect(host(fixture).textContent).toContain('Universidad Isabel I');
    expect(host(fixture).textContent).toContain('2016 — 2019');
  });

  // R97 — ejecutar teclea el guion línea a línea
  it('types the build script line by line when a job runs (R97)', fakeAsync(() => {
    const fixture = render();
    runFirstJob(fixture);

    expect(host(fixture).querySelectorAll('.pipeline__log').length).toBe(1);
    expect(host(fixture).querySelector('.pipeline__log')?.textContent).toContain(
      'git checkout -b study/universidad-isabel-i',
    );

    tick(300);
    fixture.detectChanges();
    expect(host(fixture).querySelectorAll('.pipeline__log').length).toBe(2);

    tick(FULL_BUILD_MS);
    fixture.detectChanges();
    expect(host(fixture).textContent).toContain('● MERGED → Universidad Isabel I');
  }));

  // R97 — el job queda superado y el contador sube
  it('marks the job as passed and increments the counter (R97)', fakeAsync(() => {
    const fixture = render();
    runFirstJob(fixture);
    tick(FULL_BUILD_MS);
    fixture.detectChanges();

    expect(host(fixture).querySelectorAll('.pipeline__job--passed').length).toBe(1);
    expect(host(fixture).querySelectorAll('.pipeline__run').length).toBe(1);
    expect(host(fixture).querySelector('.pipeline__counter')?.textContent).toContain('1/2');
  }));

  it('ignores a second run while the job is already running (R97)', fakeAsync(() => {
    const fixture = render();
    runFirstJob(fixture);
    tick(300);
    fixture.detectChanges();
    const linesBefore = host(fixture).querySelectorAll('.pipeline__log').length;

    fixture.debugElement.componentInstance.run(ENTRIES[0]);
    fixture.detectChanges();
    expect(host(fixture).querySelectorAll('.pipeline__log').length).toBe(linesBefore);
    tick(FULL_BUILD_MS);
  }));

  // R100 — plegar y reabrir el log de un job superado sin deshacerlo
  it('collapses and reopens the log of a passed job (R100)', fakeAsync(() => {
    const fixture = render();
    expect(host(fixture).querySelector('.pipeline__toggle')).toBeNull();
    runFirstJob(fixture);
    tick(FULL_BUILD_MS);
    fixture.detectChanges();

    const toggle = host(fixture).querySelector<HTMLButtonElement>('.pipeline__toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    fixture.detectChanges();
    expect(host(fixture).querySelector('.pipeline__terminal--closed')).toBeTruthy();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(host(fixture).querySelector('.pipeline__counter')?.textContent).toContain('1/2');

    toggle.click();
    fixture.detectChanges();
    expect(host(fixture).querySelector('.pipeline__terminal--closed')).toBeNull();
  }));

  // R98 — cursos como paquetes instalados
  it('lists the complementary courses as installed packages (R98)', () => {
    const fixture = render();
    const packages = Array.from(host(fixture).querySelectorAll('.pipeline__package')).map((c) =>
      c.textContent?.trim(),
    );
    expect(packages).toEqual(COURSES);
    expect(host(fixture).textContent).toContain('$ npm ls');
  });

  // R99 — logro al superar todos los jobs
  it('unlocks the achievement once every job has passed (R99)', fakeAsync(() => {
    const fixture = render();
    expect(host(fixture).querySelector('.pipeline__achievement')).toBeNull();

    host(fixture)
      .querySelectorAll<HTMLButtonElement>('.pipeline__run')
      .forEach((button) => button.click());
    fixture.detectChanges();
    tick(FULL_BUILD_MS);
    fixture.detectChanges();

    expect(host(fixture).querySelector('.pipeline__achievement')).toBeTruthy();
  }));

  it('clears its timers on destroy (R97)', fakeAsync(() => {
    const fixture = render();
    runFirstJob(fixture);
    fixture.destroy();
    expect(() => tick(FULL_BUILD_MS)).not.toThrow();
  }));
});
