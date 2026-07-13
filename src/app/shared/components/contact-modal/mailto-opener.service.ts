import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MailtoOpener {
  open(url: string): void {
    window.location.href = url;
  }
}
