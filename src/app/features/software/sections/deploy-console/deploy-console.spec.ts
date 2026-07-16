import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Product } from '../../product';
import { DeployConsole } from './deploy-console';

const PRODUCTS: Product[] = [
  {
    id: 'craftiva',
    name: 'Craftiva',
    tagline: 'ERP con IA',
    description: 'Plataforma de gestión empresarial con IA.',
    highlights: ['Bot de WhatsApp que agenda citas'],
    stack: ['Angular 20', 'NestJS 11'],
    logo: 'images/software/craftiva.png',
    url: 'https://appcraftiva.com',
    appStoreUrl: 'https://apps.apple.com/app/id6751239627',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.hallcsolutions.craftiva',
  },
  {
    id: 'craftdish',
    name: 'CraftDish',
    tagline: 'Restaurantes',
    description: 'SaaS para operar un restaurante completo.',
    highlights: ['Cocina en tiempo real'],
    stack: ['Angular 21'],
    logo: 'images/software/craftdish.png',
  },
];

/** Avanza el reloj lo suficiente para que cualquier despliegue termine. */
const FULL_DEPLOY_MS = 10_000;

describe('DeployConsole', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({ imports: [DeployConsole] });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function render() {
    const fixture = TestBed.createComponent(DeployConsole);
    fixture.componentRef.setInput('products', PRODUCTS);
    fixture.detectChanges();
    return fixture;
  }

  function host(fixture: ReturnType<typeof render>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  // R62 — servicios fuera de línea y contador 0/N
  it('lists every product as an offline service with the counter at zero (R62)', () => {
    const fixture = render();
    const services = host(fixture).querySelectorAll('.console__service');
    expect(services.length).toBe(2);
    expect(host(fixture).querySelectorAll('.console__deploy').length).toBe(2);
    expect(host(fixture).querySelector('.console__counter')?.textContent).toContain('0/2');
  });

  // R67 — cada servicio muestra el logo real del producto
  it('shows each product logo next to its name (R67)', () => {
    const fixture = render();
    const logos = Array.from(host(fixture).querySelectorAll<HTMLImageElement>('.console__logo'));
    expect(logos.map((img) => img.getAttribute('src'))).toEqual([
      'images/software/craftiva.png',
      'images/software/craftdish.png',
    ]);
    expect(logos[0].getAttribute('alt')).toContain('Craftiva');
  });

  // R63 — el despliegue teclea los logs y revela la ficha con el enlace
  it('types the deploy log and reveals the product card with its link (R63)', fakeAsync(() => {
    const fixture = render();
    host(fixture).querySelectorAll<HTMLButtonElement>('.console__deploy')[0].click();
    fixture.detectChanges();

    expect(host(fixture).querySelector('.console__log')?.textContent).toContain('git clone');
    expect(host(fixture).querySelector('.console__card')).toBeNull();

    tick(FULL_DEPLOY_MS);
    fixture.detectChanges();

    const card = host(fixture).querySelector('.console__card');
    expect(card?.textContent).toContain('Plataforma de gestión empresarial con IA.');
    expect(card?.textContent).toContain('Bot de WhatsApp que agenda citas');
    expect(card?.querySelector('a')?.getAttribute('href')).toBe('https://appcraftiva.com');
    expect(host(fixture).querySelector('.console__counter')?.textContent).toContain('1/2');
  }));

  // R68 — la ficha muestra el logo en grande y la línea "hecho con"
  it('shows the big logo and the built-with line in the card (R68)', fakeAsync(() => {
    const fixture = render();
    host(fixture).querySelectorAll<HTMLButtonElement>('.console__deploy')[0].click();
    tick(FULL_DEPLOY_MS);
    fixture.detectChanges();

    const card = host(fixture).querySelector('.console__card');
    expect(card?.querySelector('.console__card-logo')?.getAttribute('src')).toBe(
      'images/software/craftiva.png',
    );
    const badges = Array.from(card?.querySelectorAll('.console__badge') ?? []).map((badge) =>
      badge.textContent?.trim(),
    );
    expect(badges).toEqual(['Angular 20', 'NestJS 11']);
  }));

  // R70 — apps publicadas: enlaces reales a las tiendas
  it('links to the app stores when the product has a published app (R70)', fakeAsync(() => {
    const fixture = render();
    host(fixture).querySelectorAll<HTMLButtonElement>('.console__deploy')[0].click();
    tick(FULL_DEPLOY_MS);
    fixture.detectChanges();

    const links = Array.from(host(fixture).querySelectorAll('.console__card a')).map((a) =>
      a.getAttribute('href'),
    );
    expect(links).toContain('https://apps.apple.com/app/id6751239627');
    expect(links).toContain(
      'https://play.google.com/store/apps/details?id=com.hallcsolutions.craftiva',
    );
  }));

  // R69 — el detalle se pliega y se reabre sin apagar el servicio
  it('collapses and reopens the detail without going offline (R69)', fakeAsync(() => {
    const fixture = render();
    host(fixture).querySelectorAll<HTMLButtonElement>('.console__deploy')[0].click();
    tick(FULL_DEPLOY_MS);
    fixture.detectChanges();

    expect(host(fixture).querySelector('.console__details--closed')).toBeNull();

    host(fixture).querySelector<HTMLButtonElement>('.console__toggle')!.click();
    fixture.detectChanges();
    expect(host(fixture).querySelector('.console__details--closed')).toBeTruthy();
    expect(host(fixture).querySelector('.console__counter')?.textContent).toContain('1/2');

    host(fixture).querySelector<HTMLButtonElement>('.console__toggle')!.click();
    fixture.detectChanges();
    expect(host(fixture).querySelector('.console__details--closed')).toBeNull();
  }));

  // R64 — sin URL pública: "próximamente", sin enlace
  it('shows coming soon instead of a link when the product has no url (R64)', fakeAsync(() => {
    const fixture = render();
    host(fixture).querySelectorAll<HTMLButtonElement>('.console__deploy')[1].click();
    tick(FULL_DEPLOY_MS);
    fixture.detectChanges();

    const card = host(fixture).querySelector('.console__card');
    expect(card?.querySelector('a')).toBeNull();
    expect(card?.querySelector('.console__soon')).toBeTruthy();
  }));

  // R65 — todos en línea: logro N/N
  it('celebrates when every product is online (R65)', fakeAsync(() => {
    const fixture = render();
    expect(host(fixture).querySelector('.console__achievement')).toBeNull();

    for (const button of Array.from(
      host(fixture).querySelectorAll<HTMLButtonElement>('.console__deploy'),
    )) {
      button.click();
      tick(FULL_DEPLOY_MS);
      fixture.detectChanges();
    }

    expect(host(fixture).querySelector('.console__achievement')).toBeTruthy();
    expect(host(fixture).querySelector('.console__counter')?.textContent).toContain('2/2');
  }));
});
