import { Routes } from '@angular/router';
import { PrivacyPage } from './privacy/privacy-page';

export const CHRANTA_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'privacy/en' },
  { path: 'privacy', pathMatch: 'full', redirectTo: 'privacy/en' },
  { path: 'privacy/:lang', component: PrivacyPage, title: 'Chranta · Privacy Policy' },
];
