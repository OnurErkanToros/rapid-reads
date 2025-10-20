import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun, faChartLine } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  template: `
    <nav class="sticky top-0 z-40 bg-gray-800 shadow-md">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <a 
            routerLink="/" 
            class="text-white text-xl font-bold hover:text-gray-300 transition-colors duration-200"
          >
            RapidReads
          </a>
          <a 
            routerLink="/stats"
            routerLinkActive="bg-gray-700"
            class="btn-ghost text-white hover:bg-gray-700 flex items-center gap-2"
            title="İstatistiklerinizi görüntüleyin"
          >
            <fa-icon [icon]="iconChartLine"></fa-icon>
            <span>İstatistikler</span>
          </a>
        </div>
        <button 
          (click)="themeService.toggleTheme()"
          [title]="themeService.isDarkMode ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'"
          class="btn-ghost text-white hover:bg-gray-700 p-2"
        >
          <fa-icon *ngIf="!themeService.isDarkMode" [icon]="iconMoon" class="text-lg"></fa-icon>
          <fa-icon *ngIf="themeService.isDarkMode" [icon]="iconSun" class="text-lg"></fa-icon>
        </button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  iconMoon = faMoon;
  iconSun = faSun;
  iconChartLine = faChartLine;
  
  constructor(public themeService: ThemeService) {}
}

