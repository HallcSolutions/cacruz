import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import {
  CONTACT_EMAIL,
  GITHUB_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
} from './hero-links';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  readonly contactRequested = output<void>();

  protected readonly githubUrl = GITHUB_PROFILE_URL;
  protected readonly linkedinUrl = LINKEDIN_PROFILE_URL;
  protected readonly email = CONTACT_EMAIL;
  protected readonly emailUrl = `mailto:${CONTACT_EMAIL}`;
}
