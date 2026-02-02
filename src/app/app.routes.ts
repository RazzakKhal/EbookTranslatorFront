import { Routes } from '@angular/router';
import { TranslatorMainPage } from './features/translate/pages/translator-main-page/translator-main-page';
import { LandingMainPage } from './features/landing/pages/landing-main-page/landing-main-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingMainPage,
  },
  {
    path: 'translate',
    component: TranslatorMainPage,
  },
];
