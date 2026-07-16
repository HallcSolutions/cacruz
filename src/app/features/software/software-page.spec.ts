import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from './product';
import { SoftwarePage } from './software-page';

const PRODUCTS: Product[] = [
  {
    id: 'craftiva',
    name: 'Craftiva',
    tagline: 'ERP con IA',
    description: 'Plataforma de gestión.',
    highlights: [],
    stack: ['Angular 20'],
    logo: 'images/software/craftiva.png',
    url: 'https://appcraftiva.com',
  },
];

describe('SoftwarePage', () => {
  let fixture: ComponentFixture<SoftwarePage>;

  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      imports: [SoftwarePage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(SoftwarePage);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  // R62 — la página presenta la consola con los productos del contenido
  it('renders the deploy console with the loaded products (R62)', async () => {
    TestBed.tick();
    TestBed.inject(HttpTestingController).expectOne('content/software.es.json?v=2').flush(PRODUCTS);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host().textContent).toContain('Software que he construido');
    expect(host().querySelector('app-deploy-console')).toBeTruthy();
    expect(host().textContent).toContain('Craftiva');
  });
});
