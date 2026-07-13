import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';
import { ProfileContent } from './profile-content';
import { profileContentUrl } from './profile-content-url';

@Injectable({ providedIn: 'root' })
export class ProfileContentService {
  private readonly i18n = inject(TranslationService);

  readonly content = httpResource<ProfileContent>(() => profileContentUrl(this.i18n.language()));
}
