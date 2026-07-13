import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { BlogService } from '../../services/blog.service';
import { formatPostDate } from '../../services/format-post-date';
import { isExternalLink, parseRichText, TextSpan } from '../../services/parse-rich-text';

@Component({
  selector: 'app-blog-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, RevealOnScrollDirective],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPostPage {
  readonly slug = input<string>();

  protected readonly i18n = inject(TranslationService);
  protected readonly post = inject(BlogService).postResource(() => this.slug());

  protected formatDate(isoDate: string): string {
    return formatPostDate(isoDate, this.i18n.language());
  }

  protected spans(text: string): TextSpan[] {
    return parseRichText(text);
  }

  protected isExternal(url: string): boolean {
    return isExternalLink(url);
  }
}
