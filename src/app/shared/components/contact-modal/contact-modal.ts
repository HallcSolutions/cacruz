import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  output,
  signal,
} from '@angular/core';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { buildConsoleLines } from './build-console-lines';
import { isCompleteMessage, isValidEmail } from './build-mailto-url';
import { ContactSender } from './contact-sender.service';
import { SendStatus } from './send-status';

@Component({
  selector: 'app-contact-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.css',
})
export class ContactModal {
  readonly closed = output<void>();

  private readonly sender = inject(ContactSender);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly message = signal('');
  protected readonly submitted = signal(false);
  protected readonly status = signal<SendStatus>('idle');

  private readonly draft = computed(() => ({
    name: this.name(),
    email: this.email(),
    message: this.message(),
  }));

  protected readonly consoleLines = computed(() => buildConsoleLines(this.draft()));
  protected readonly canSend = computed(
    () => isCompleteMessage(this.draft()) && this.status() !== 'sending',
  );

  protected readonly nameInvalid = computed(
    () => this.submitted() && this.name().trim().length === 0,
  );
  protected readonly emailInvalid = computed(() => this.submitted() && !isValidEmail(this.email()));
  protected readonly messageInvalid = computed(
    () => this.submitted() && this.message().trim().length === 0,
  );

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.closed.emit();
  }

  protected update(field: 'name' | 'email' | 'message', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this[field].set(value);
  }

  protected async send(event: Event): Promise<void> {
    event.preventDefault();
    this.submitted.set(true);
    if (!this.canSend()) {
      return;
    }

    this.status.set('sending');
    try {
      await this.sender.send(this.draft());
      this.status.set('sent');
    } catch {
      this.status.set('failed');
    }
  }
}
