import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { RichText } from '../../components/rich-text/rich-text';
import { BlogService } from '../../services/blog.service';
import { formatPostDate } from '../../services/format-post-date';
import { youtubeEmbedUrl } from '../../services/youtube-embed-url';

@Component({
  selector: 'app-blog-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, RevealOnScrollDirective, RichText],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPostPage {
  readonly slug = input<string>();

  protected readonly i18n = inject(TranslationService);
  protected readonly post = inject(BlogService).postResource(() => this.slug());

  private readonly sanitizer = inject(DomSanitizer);

  protected formatDate(isoDate: string): string {
    return formatPostDate(isoDate, this.i18n.language());
  }

  protected videoUrl(youtubeId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl(youtubeId));
  }
}
