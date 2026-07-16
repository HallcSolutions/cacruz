import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../../core/i18n/translation.service';
import { Product } from './product';
import { SoftwareContentService } from './software-content.service';

const FAKE_PRODUCTS: Product[] = [
  {
    id: 'craftiva',
    name: 'Craftiva',
    tagline: 'ERP con IA',
    description: 'Plataforma de gestión empresarial.',
    highlights: ['Bot de WhatsApp'],
    stack: ['Angular 20', 'NestJS 11'],
    logo: 'images/software/craftiva.png',
    url: 'https://appcraftiva.com',
  },
];

describe('SoftwareContentService', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  // R62 — el contenido de los productos vive versionado y es bilingüe
  it('loads the products for the active language (R62)', async () => {
    const service = TestBed.inject(SoftwareContentService);
    const http = TestBed.inject(HttpTestingController);

    TestBed.tick();
    http.expectOne('content/software.es.json').flush(FAKE_PRODUCTS);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.products.value()).toEqual(FAKE_PRODUCTS);
  });

  it('reloads the products when the language changes (R62, R13)', async () => {
    const service = TestBed.inject(SoftwareContentService);
    const http = TestBed.inject(HttpTestingController);
    TestBed.tick();
    http.expectOne('content/software.es.json').flush(FAKE_PRODUCTS);
    await TestBed.inject(ApplicationRef).whenStable();

    TestBed.inject(TranslationService).setLanguage('en');
    TestBed.tick();

    http.expectOne('content/software.en.json').flush(FAKE_PRODUCTS);
    await TestBed.inject(ApplicationRef).whenStable();
    expect(service.products.value()).toEqual(FAKE_PRODUCTS);
  });
});
