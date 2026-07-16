import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslationService } from '../../core/i18n/translation.service';
import { Product } from './product';

@Injectable({ providedIn: 'root' })
export class SoftwareContentService {
  private readonly i18n = inject(TranslationService);

  readonly products = httpResource<Product[]>(() => `content/software.${this.i18n.language()}.json`);
}
