import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

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
});
