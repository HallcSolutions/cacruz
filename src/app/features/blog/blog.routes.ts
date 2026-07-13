import { Routes } from '@angular/router';
import { BlogListPage } from './pages/blog-list/blog-list';
import { BlogPostPage } from './pages/blog-post/blog-post';

export const BLOG_ROUTES: Routes = [
  { path: '', component: BlogListPage },
  { path: ':slug', component: BlogPostPage },
];
