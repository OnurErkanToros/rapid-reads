import { Routes } from '@angular/router';
import { Library } from './pages/library/library';
import { Reader } from './pages/reader/reader';
import { Player } from './pages/player/player';
import { Stats } from './pages/stats/stats';

export const routes: Routes = [
  {
    path: '',
    component: Library,
    pathMatch: 'full'
  },
  {
    path: 'reader/:id',
    component: Reader
  },
  {
    path: 'player/:id/:chapterHref',
    component: Player
  },
  {
    path: 'player/text',
    component: Player
  },
  {
    path: 'stats',
    component: Stats
  }
];
