import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CONTACT_API_URL } from '../../../core/config/contact-api';
import { ContactMessage } from './contact-message';

@Injectable({ providedIn: 'root' })
export class ContactSender {
  private readonly http = inject(HttpClient);

  async send(message: ContactMessage): Promise<void> {
    await firstValueFrom(this.http.post<{ status: string }>(CONTACT_API_URL, message));
  }
}
