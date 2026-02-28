import { Routes } from '@angular/router';
import { canActivateAuth } from './shared/guards/keycloak-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/pages/landing-main-page/landing-main-page').then(
        (m) => m.LandingMainPage,
      ),
  },
  {
    path: 'translate',
    loadComponent: () =>
      import('./features/translate/pages/translator-main-page/translator-main-page').then(
        (m) => m.TranslatorMainPage,
      ),
    canActivate: [canActivateAuth],
  },
];
