import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_URL,
  GITHUB_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
  YOUTUBE_PROFILE_URL,
} from './hero-links';
import { INITIAL_TYPEWRITER_STATE, nextTypewriterState, typewriterText } from './typewriter';

const TYPE_WORDS = [
  'Angular',
  '.NET · C#',
  'TypeScript',
  'NestJS',
  'Node.js',
  'Laravel · PHP',
  'Flutter · Dart',
  'Vue.js',
  'SQL Server',
  'MongoDB',
  'IA & Agentes',
] as const;
const TYPE_TICK_MS = 80;

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly githubUrl = GITHUB_PROFILE_URL;
  protected readonly linkedinUrl = LINKEDIN_PROFILE_URL;
  protected readonly youtubeUrl = YOUTUBE_PROFILE_URL;
  protected readonly instagramUrl = INSTAGRAM_PROFILE_URL;
  protected readonly email = CONTACT_EMAIL;
  protected readonly emailUrl = `mailto:${CONTACT_EMAIL}`;
  protected readonly phone = CONTACT_PHONE;
  protected readonly phoneUrl = CONTACT_PHONE_URL;
  protected readonly typed = signal('');

  constructor() {
    let state = INITIAL_TYPEWRITER_STATE;
    const intervalId = setInterval(() => {
      state = nextTypewriterState(TYPE_WORDS, state);
      this.typed.set(typewriterText(TYPE_WORDS, state));
    }, TYPE_TICK_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(intervalId));
  }
}
