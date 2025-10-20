import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private WPM_KEY = 'rapidreads_wpm';
  private FONT_SIZE_KEY = 'rapidreads_font_size';
  private CHUNK_SIZE_KEY = 'rapidreads_chunk_size';

  constructor() {}

  public saveWpm(wpm: number): void {
    localStorage.setItem(this.WPM_KEY, wpm.toString());
  }

  public loadWpm(): number {
    const value = localStorage.getItem(this.WPM_KEY);
    if (value === null) {
      return 250; // Varsayılan değer
    }
    return Number(value);
  }

  public saveFontSize(size: number): void {
    localStorage.setItem(this.FONT_SIZE_KEY, size.toString());
  }

  public loadFontSize(): number {
    const value = localStorage.getItem(this.FONT_SIZE_KEY);
    if (value === null) {
      return 72; // Varsayılan değer
    }
    return Number(value);
  }

  public saveChunkSize(size: number): void {
    localStorage.setItem(this.CHUNK_SIZE_KEY, size.toString());
  }

  public loadChunkSize(): number {
    const value = localStorage.getItem(this.CHUNK_SIZE_KEY);
    if (value === null) {
      return 1; // Varsayılan değer
    }
    return Number(value);
  }
}

