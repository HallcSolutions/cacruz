import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ValuePage } from './value-page';

describe('ValuePage', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      imports: [ValuePage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(ValuePage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  // R45 — casos numerados
  it('renders the six numbered cases (R45)', () => {
    const host = render();
    const numbers = Array.from(host.querySelectorAll('.case__number')).map((n) =>
      n.textContent?.trim(),
    );
    expect(numbers).toEqual(['01', '02', '03', '04', '05', '06']);
    expect(host.textContent).toContain('Librerías y microfrontends que evitan reescribir');
    expect(host.textContent).toContain('Defectos atrapados antes del usuario');
  });

  // R45 — la IA gobernada por especificación abre la lista
  it('leads with the AI case (R45)', () => {
    const titles = Array.from(render().querySelectorAll('.case__title')).map((t) =>
      t.textContent?.trim(),
    );
    expect(titles[0]).toBe('IA gobernada por especificación');
    expect(titles[titles.length - 1]).toBe('Equipos que entregan y aprenden');
  });

  // R45 — credibilidad: cada caso dice dónde se hizo y qué mejoró
  it('states where each case happened and what it improved (R45)', () => {
    const host = render();
    const companies = Array.from(host.querySelectorAll('.case__companies')).map((p) =>
      p.textContent?.trim(),
    );
    const results = Array.from(host.querySelectorAll('.case__result-text')).map((r) =>
      r.textContent?.trim(),
    );
    expect(companies.length).toBe(6);
    expect(results.length).toBe(6);
    expect(companies[0]).toContain('Think Us');
    expect(results[0]).toContain('especificación aprobada');
  });

  // R45 — franja de credenciales
  it('opens with the credentials strip (R45)', () => {
    const values = Array.from(render().querySelectorAll('.credential__value')).map((v) =>
      v.textContent?.trim(),
    );
    expect(values).toEqual(['12+', '10', '2', '3']);
  });

  // R45 — llamado a la acción con contacto (un único CTA, como el inicio)
  it('closes with a single contact call to action (R45)', () => {
    const host = render();
    const actions = host.querySelectorAll('.value__actions .value__action');
    expect(actions.length).toBe(1);
    expect(host.querySelector('.value__action--primary')).toBeTruthy();
  });

  // R46 — el CTA abre el modal de contacto
  it('opens the contact modal from the call to action (R46)', () => {
    const fixture = TestBed.createComponent(ValuePage);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('app-contact-modal')).toBeNull();
    host.querySelector<HTMLButtonElement>('.value__action--primary')!.click();
    fixture.detectChanges();
    expect(host.querySelector('app-contact-modal')).toBeTruthy();
  });

  // R13 — la página cambia de idioma
  it('renders in Spanish by default (R13, R15)', () => {
    expect(render().textContent).toContain('Cómo te puedo ayudar');
  });
});
