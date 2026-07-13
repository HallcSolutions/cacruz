import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { formatPostDate } from '../../services/format-post-date';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export class BlogListPage {
  protected readonly blog = inject(BlogService);
  protected readonly i18n = inject(TranslationService);

  protected formatDate(isoDate: string): string {
    return formatPostDate(isoDate, this.i18n.language());
  }

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
