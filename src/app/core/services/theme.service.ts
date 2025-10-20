import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private THEME_KEY = 'rapidreads_theme';
  public isDarkMode: boolean = false;

  constructor() {
    this.loadThemeOnStart();
  }

  public loadThemeOnStart(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
    } else {
      this.isDarkMode = false;
    }
    
    this.updateHtmlClass();
  }

  public toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(this.THEME_KEY, this.isDarkMode ? 'dark' : 'light');
    console.log('🌙 Theme toggled to:', this.isDarkMode ? 'dark' : 'light');
    this.updateHtmlClass();
  }

  private updateHtmlClass(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      console.log('✅ Dark class added to HTML');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('☀️ Dark class removed from HTML');
    }
    console.log('📋 Current HTML classes:', document.documentElement.classList.toString());
  }
}
