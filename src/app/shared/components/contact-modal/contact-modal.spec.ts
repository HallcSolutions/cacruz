import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactMessage } from './contact-message';
import { ContactModal } from './contact-modal';
import { ContactSender } from './contact-sender.service';

class FakeContactSender {
  readonly sent: ContactMessage[] = [];
  shouldFail = false;
  private resolvePending?: () => void;
  private rejectPending?: () => void;

  send(message: ContactMessage): Promise<void> {
    this.sent.push(message);
    return new Promise<void>((resolve, reject) => {
      this.resolvePending = resolve;
      this.rejectPending = () => reject(new Error('send_failed'));
    });
  }

  settle(): Promise<void> {
    if (this.shouldFail) {
      this.rejectPending?.();
    } else {
      this.resolvePending?.();
    }
    return Promise.resolve();
  }
}

describe('ContactModal', () => {
  let fixture: ComponentFixture<ContactModal>;
  let sender: FakeContactSender;
  let closed: number;

  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    sender = new FakeContactSender();
    TestBed.configureTestingModule({
      imports: [ContactModal],
      providers: [{ provide: ContactSender, useValue: sender }],
    });
    fixture = TestBed.createComponent(ContactModal);
    closed = 0;
    fixture.componentInstance.closed.subscribe(() => closed++);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function fill(selector: string, value: string): void {
    const input = host().querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submit(): void {
    host().querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
  }

  function fillValid(): void {
    fill('input[name="name"]', 'Ana Gómez');
    fill('input[name="email"]', 'ana@empresa.com');
    fill('textarea[name="message"]', 'Buscamos líder técnico.');
  }

  // R46 — modal tipo terminal con avatar y los tres campos
  it('shows a developer terminal with the avatar and the three fields (R46)', () => {
    expect(host().querySelector('.terminal__avatar')?.getAttribute('src')).toBe(
      'images/avatar.png',
    );
    expect(host().querySelector('input[name="name"]')).toBeTruthy();
    expect(host().querySelector('input[name="email"]')).toBeTruthy();
    expect(host().querySelector('textarea[name="message"]')).toBeTruthy();
  });

  // R46 — se cierra con la X, con el fondo y con Escape
  it('closes with the close button (R46)', () => {
    host().querySelector<HTMLButtonElement>('.terminal__close')!.click();
    expect(closed).toBe(1);
  });

  it('closes when clicking the backdrop (R46)', () => {
    host().querySelector<HTMLElement>('.backdrop')!.click();
    expect(closed).toBe(1);
  });

  it('closes on Escape (R46)', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closed).toBe(1);
  });

  // R47 — no envía con datos inválidos y marca los campos
  it('blocks the submission and flags every empty field (R47)', () => {
    submit();
    expect(host().querySelectorAll('.field__error').length).toBe(3);
    expect(sender.sent).toEqual([]);
  });

  it('flags an invalid email (R47)', () => {
    fill('input[name="name"]', 'Ana');
    fill('input[name="email"]', 'ana');
    fill('textarea[name="message"]', 'Hola');
    submit();
    const errors = Array.from(host().querySelectorAll('.field__error')).map((e) =>
      e.textContent?.trim(),
    );
    expect(errors).toEqual(['Escribe un correo válido.']);
    expect(sender.sent).toEqual([]);
  });

  // R49 — el botón permanece deshabilitado hasta que todo sea válido
  it('keeps the send button disabled until the form is valid (R49)', () => {
    const button = () => host().querySelector<HTMLButtonElement>('.submit')!;
    expect(button().disabled).toBeTrue();

    fill('input[name="name"]', 'Ana');
    fill('textarea[name="message"]', 'Hola');
    expect(button().disabled).toBeTrue();

    fill('input[name="email"]', 'ana');
    expect(button().disabled).toBeTrue();

    fill('input[name="email"]', 'ana@empresa.com');
    expect(button().disabled).toBeFalse();
  });

  // R50 — la consola refleja lo que se escribe y anuncia cuando está listo
  it('echoes what the visitor types into the live console (R50)', () => {
    const lines = () =>
      Array.from(host().querySelectorAll('.console__text')).map((l) => l.textContent?.trim());

    expect(lines()[0]).toBe('./contactar --a christian');
    expect(lines()[lines().length - 1]).toContain('esperando');

    fill('input[name="name"]', 'Ana Gómez');
    expect(lines()).toContain('name = "Ana Gómez"');

    fill('input[name="email"]', 'ana@empresa.com');
    fill('textarea[name="message"]', 'Hola Christian');
    expect(lines()[lines().length - 1]).toBe('listo para enviar ✓');
    expect(host().querySelector('.console__line--ready')).toBeTruthy();
  });

  // R51 — el mensaje se envía por el servicio propio, sin abrir el correo del visitante
  it('sends the message through the contact service (R51)', async () => {
    fillValid();
    submit();

    expect(sender.sent).toEqual([
      { name: 'Ana Gómez', email: 'ana@empresa.com', message: 'Buscamos líder técnico.' },
    ]);
  });

  // R52 — mientras se envía aparece el mensajero, y al terminar el acuse de entrega
  it('shows the courier while sending and the delivery confirmation (R52)', async () => {
    fillValid();
    submit();

    expect(host().querySelector('.delivery')).toBeTruthy();
    expect(host().querySelector('.delivery--done')).toBeNull();
    expect(host().querySelector('form')).toBeNull();

    await sender.settle();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host().querySelector('.delivery--done')).toBeTruthy();
    expect(host().querySelector('.delivery__ok')?.textContent).toContain('Entregado');
  });

  // R53 — un fallo se informa y deja reintentar sin perder lo escrito
  it('reports a failure and keeps the form to retry (R53)', async () => {
    sender.shouldFail = true;
    fillValid();
    submit();

    await sender.settle();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host().querySelector('.send-error')).toBeTruthy();
    expect(host().querySelector<HTMLInputElement>('input[name="name"]')!.value).toBe('Ana Gómez');
    expect(host().querySelector<HTMLButtonElement>('.submit')!.disabled).toBeFalse();
  });
});
