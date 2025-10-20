import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import ePub from 'epubjs';
import { StorageService } from '../../core/services/storage.service';
import { IBook } from '../../core/models/book.model';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="flex flex-col h-screen bg-gray-100">
      <!-- Üst Navigasyon -->
      <div class="bg-white shadow-md p-4 flex items-center justify-between">
        <button 
          (click)="goBack()" 
          class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ← Geri
        </button>
        <a 
          routerLink="/" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          🏠 Kütüphaneye Dön
        </a>
      </div>

      <!-- Kelime Gösterim Alanı -->
      <div class="flex-1 flex items-center justify-center">
        <div class="text-6xl md:text-8xl font-serif text-gray-800 font-bold text-center px-4">
          {{ currentWord }}
        </div>
      </div>

      <!-- Alt Kontrol Paneli -->
      <div class="bg-white p-4 shadow-inner">
        <div class="container mx-auto max-w-2xl space-y-4">
          <!-- WPM Kontrolü -->
          <div class="flex items-center justify-between">
            <label class="text-gray-700 font-semibold">Hız: {{ wpm }} WPM</label>
            <input 
              type="range" 
              [(ngModel)]="wpm" 
              min="100" 
              max="1500" 
              step="25"
              class="flex-1 mx-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <!-- Play/Pause Butonu -->
          <div class="flex justify-center">
            <button 
              (click)="togglePlay()"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-12 rounded-lg shadow-lg transition-colors duration-200 text-xl"
            >
              {{ isPlaying ? '⏸ Pause' : '▶ Play' }}
            </button>
          </div>

          <!-- İlerleme Göstergesi -->
          <div class="text-center text-gray-600 text-sm">
            Kelime {{ currentWordIndex + 1 }} / {{ words.length }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      padding: 20px;
    }
  `]
})
export class PlayerComponent implements OnInit {
  book: IBook | undefined;
  currentChapterHref: string | null = null;
  words: string[] = [];
  currentWordIndex: number = 0;
  currentWord: string = '';
  wpm: number = 250;
  isPlaying: boolean = false;
  private readingInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadChapter();
  }

  async loadChapter(): Promise<void> {
    // URL'den parametreleri al
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const encodedChapterHref = this.route.snapshot.paramMap.get('chapterHref');

    if (!id || !encodedChapterHref) return;

    // Base64 decode
    const chapterHref = decodeURIComponent(atob(encodedChapterHref));

    // Mevcut bölümü sakla
    this.currentChapterHref = chapterHref;

    // Kitabı veritabanından çek
    this.book = await this.storageService.getBookById(id);

    if (!this.book || !this.book.file) return;

    // EPUB dosyasını ArrayBuffer'a çevir ve yükle
    const arrayBuffer = await this.book.file.arrayBuffer();
    const epubBook = ePub(arrayBuffer);

    // Doğru bölümü bul
    const section = epubBook.section(chapterHref);

    // Bölümün HTML içeriğini yükle
    const contents = await section.load();
    // HTML içeriğindeki tüm HTML etiketlerini temizle
    const cleanText = this.stripHtml(contents.documentElement.innerHTML);
    console.log('🔍 Temizlenmiş metin uzunluğu:', cleanText.length);
    console.log('📝 İlk 200 karakter:', cleanText.substring(0, 200));

    // Metni kelimelere böl ve boş elemanları filtrele
    this.words = cleanText
      .split(/\s+/)
      .map(word => word.trim())
      .filter(Boolean);
    
    console.log('📚 Toplam kelime sayısı:', this.words.length);
    console.log('🔤 İlk 10 kelime:', this.words.slice(0, 10));

    // Epub.js'i hafızadan temizle
    epubBook.destroy();

    // Başlangıç indeksini ayarla
    this.currentWordIndex = 0;

    // Eğer kayıtlı ilerleme varsa ve aynı bölümdeyse, oradan devam et
    if (this.book.progress && 
        this.book.progress.chapterHref === chapterHref && 
        this.book.progress.wordIndex !== undefined) {
      this.currentWordIndex = this.book.progress.wordIndex;
    }

    // İlk (veya kaldığı) kelimeyi ayarla
    if (this.words.length > 0) {
      this.currentWord = this.words[this.currentWordIndex];
      console.log('✅ İlk kelime:', this.currentWord);
    } else {
      console.error('❌ Kelime dizisi boş!');
    }
  }

  private stripHtml(html: string): string {
    if (!html) {
      console.warn('⚠️ stripHtml: Boş HTML alındı');
      return '';
    }
    
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    
    // Fazla boşlukları ve satır sonlarını temizle
    return text
      .replace(/\s+/g, ' ')  // Birden fazla boşluğu tek boşluğa indir
      .trim();                // Baştan ve sondan boşlukları temizle
  }

  goBack(): void {
    this.location.back();
  }

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    
    if (this.isPlaying) {
      this.startReading();
    } else {
      this.stopReading();
    }
  }

  startReading(): void {
    // WPM'den milisaniye hesapla
    const intervalMs = (60 / this.wpm) * 1000;
    
    this.readingInterval = setInterval(() => {
      this.nextWord();
    }, intervalMs);
  }

  stopReading(): void {
    clearInterval(this.readingInterval);
    this.saveProgress();
  }

  nextWord(): void {
    this.currentWordIndex++;
    
    // Eğer kelimeler bittiyse durdur
    if (this.currentWordIndex >= this.words.length) {
      this.isPlaying = false;
      this.stopReading();
      return;
    }
    
    // Sonraki kelimeyi göster
    this.currentWord = this.words[this.currentWordIndex];
  }

  private saveProgress(): void {
    // Görev 5.4'te implement edilecek
    console.log('Progress saved:', this.currentWordIndex);
  }
}

