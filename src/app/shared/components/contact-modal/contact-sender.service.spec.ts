import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CONTACT_API_URL } from '../../../core/config/contact-api';
import { ContactSender } from './contact-sender.service';

const MESSAGE = { name: 'Ana', email: 'ana@empresa.com', message: 'Hola' };

describe('ContactSender', () => {
  let sender: ContactSender;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    sender = TestBed.inject(ContactSender);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // R51 — el mensaje viaja al servicio propio, no al cliente de correo del visitante
  it('posts the message to the contact service (R51)', async () => {
    const sent = sender.send(MESSAGE);

    const request = http.expectOne(CONTACT_API_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(MESSAGE);
    request.flush({ status: 'sent' });

    await expectAsync(sent).toBeResolved();
  });

  // R53 — un fallo del servicio se propaga para poder reintentar
  it('rejects when the service fails (R53)', async () => {
    const sent = sender.send(MESSAGE);
    http.expectOne(CONTACT_API_URL).flush(
      { error: 'send_failed' },
      { status: 502, statusText: 'Bad Gateway' },
    );

    await expectAsync(sent).toBeRejected();
  });
});
