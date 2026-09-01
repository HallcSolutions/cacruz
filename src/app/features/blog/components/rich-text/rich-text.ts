import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { isExternalLink, parseRichText, TextSpan } from '../../services/parse-rich-text';

/**
 * Pinta el texto de una nota con sus marcas: enlaces (R55), destacados (R101),
 * código en línea (R102) y código dentro de un destacado (R104). Vive en un solo sitio porque párrafos y pasos
 * lo renderizan igual.
 */
@Component({
  selector: 'app-rich-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (span of spans(); track $index) {
      @switch (span.kind) {
        @case ('link') {
          <a
            [href]="span.url"
            [attr.target]="isExternal(span.url) ? '_blank' : null"
            [attr.rel]="isExternal(span.url) ? 'noopener' : null"
            >{{ span.text }}</a
          >
        }
        @case ('strong') {
          <strong>
            @for (inner of span.spans; track $index) {
              @switch (inner.kind) {
                @case ('code') {
                  <code>{{ inner.text }}</code>
                }
                @case ('text') {
                  <span>{{ inner.text }}</span>
                }
              }
            }
          </strong>
        }
        @case ('code') {
          <code>{{ span.text }}</code>
        }
        @default {
          <span>{{ span.text }}</span>
        }
      }
    }
  `,
  styleUrl: './rich-text.css',
})
export class RichText {
  readonly text = input.required<string>();

  protected readonly spans = computed<TextSpan[]>(() => parseRichText(this.text()));

  protected isExternal(url: string): boolean {
    return isExternalLink(url);
  }
}
