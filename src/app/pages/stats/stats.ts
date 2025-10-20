import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { StorageService, IReadingSession } from '../../core/services/storage.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats implements OnInit {
  public totalMinutesRead: number = 0;
  public totalWordsRead: number = 0;
  public averageWpm: number = 0;
  public totalSessions: number = 0;
  public isLoading: boolean = true;
  iconArrowLeft = faArrowLeft;

  constructor(
    private storageService: StorageService,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // 1. Tüm seansları veritabanından çek
      const sessions = await this.storageService.getAllReadingSessions();
      this.totalSessions = sessions.length;
      
      if (this.totalSessions === 0) {
        return; // Seans yoksa hesaplama yapma
      }

      let totalMs = 0;
      let totalWords = 0;

      // 2. Tüm seansları döngüye al ve verileri topla
      for (const session of sessions) {
        totalWords += session.wordsRead;
        totalMs += (session.endTime - session.startTime); // Milisaniye cinsinden süre
      }

      this.totalWordsRead = totalWords;

      // 3. Milisaniyeyi dakikaya çevir
      const totalMinutes = totalMs / 60000; // (1000ms * 60sn)
      this.totalMinutesRead = Math.round(totalMinutes);

      // 4. Ortalama WPM'i (Dakika Başına Kelime) hesapla
      if (totalMinutes > 0) {
        this.averageWpm = Math.round(this.totalWordsRead / totalMinutes);
      }
      
    } catch (err) {
      console.error("İstatistikler yüklenirken hata oluştu:", err);
    } finally {
      this.isLoading = false; // Yükleme bitti (başarılı veya hatalı)
    }
  }

  public goBack(): void {
    this.location.back();
  }
}
