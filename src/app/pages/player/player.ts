import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import ePub from 'epubjs';
import { StorageService, IReadingSession } from '../../core/services/storage.service';
import { SettingsService } from '../../core/services/settings.service';
import { IBook, IBookProgress } from '../../core/models/book.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-player',
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './player.html',
  styleUrl: './player.scss'
})
export class Player implements OnInit, OnDestroy {
  book: IBook | undefined;
  currentChapterHref: string | null = null;
  rawWords: string[] = [];
  public groupedWords: string[] = [];
  currentChunkIndex: number = 0;
  currentChunk: string = '';
  public chunkBeforeOrp: string = '';
  public chunkOrpChar: string = '';
  public chunkAfterOrp: string = '';
  wpm: number = 250;
  fontSize: number = 72;
  public chunkSize: number = 1;
  isPlaying: boolean = false;
  private readingInterval: any;
  public sessionStartTime: number | null = null;
  public sessionStartChunkIndex: number = 0;
  public isUiVisible: boolean = true; // Başlangıçta UI görünür olsun
  private idleTimeout: any; // setTimeout ID'sini tutacak
  iconPlay = faPlay;
  iconPause = faPause;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private storageService: StorageService,
    private settingsService: SettingsService
  ) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Space':
        event.preventDefault(); // Sayfanın kaymasını engelle
        this.togglePlay();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previousWord();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.skipWord();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.increaseWpm();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.decreaseWpm();
        break;
    }
  }

  @HostListener('document:mousemove')
  @HostListener('document:touchstart')
  showUiTemporarily(): void {
    // 1. UI'ı görünür yap
    this.isUiVisible = true;

    // 2. Mevcut gizleme zamanlayıcısını (varsa) iptal et
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }

    // 3. Yeni bir gizleme zamanlayıcısı ayarla (3 saniye hareketsizlikten sonra)
    this.idleTimeout = setTimeout(() => {
      this.isUiVisible = false;
    }, 3000); // 3000 milisaniye = 3 saniye
  }

  async ngOnInit(): Promise<void> {
    this.wpm = this.settingsService.loadWpm();
    this.fontSize = this.settingsService.loadFontSize();
    this.chunkSize = this.settingsService.loadChunkSize();
    await this.loadChapter();
    
    // Görev 10.11: Başlangıçta UI görünsün ve gizleme zamanlayıcısı başlasın
    this.showUiTemporarily();
  }

  async loadChapter(): Promise<void> {
    // State'ten yapıştırılan metni kontrol et
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || (window.history.state as any);
    const pastedText = state?.textToRead;

    if (pastedText) {
      // Yapıştırılan metin varsa direkt işle
      await this.loadPastedText(pastedText);
      return;
    }

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

    console.log('📖 EPUB kitap yüklendi');
    console.log('🔗 Aranan chapterHref:', chapterHref);

    // Spine'dan tüm bölümleri await ile bekle
    await epubBook.ready;
    
    console.log('📚 EPUB hazır');
    console.log('📋 Spine içeriği:', epubBook.spine);

    // Doğru bölümü bul
    const section = epubBook.spine.get(chapterHref);

    if (!section) {
      console.error('❌ Bölüm bulunamadı! chapterHref:', chapterHref);
      console.log('📋 Spine:', epubBook.spine);
      alert('Bölüm bulunamadı. Lütfen içindekiler sayfasından tekrar deneyin.');
      return;
    }

    console.log('✅ Bölüm bulundu:', section);

    // Bölümün HTML içeriğini yükle
    const contents = await section.load(epubBook.load.bind(epubBook));
    console.log('📄 Contents tipi:', typeof contents);
    console.log('📄 Contents:', contents);

    // Contents string ise direkt kullan, değilse document'ten al
    let htmlContent = '';
    if (typeof contents === 'string') {
      htmlContent = contents;
    } else if (contents?.documentElement?.innerHTML) {
      htmlContent = contents.documentElement.innerHTML;
    } else if ((contents as any)?.innerHTML) {
      htmlContent = (contents as any).innerHTML;
    } else {
      console.error('❌ HTML içeriği alınamadı');
      alert('Bölüm içeriği okunamadı');
      return;
    }

    console.log('📝 HTML içerik uzunluğu:', htmlContent.length);

    // HTML içeriğindeki tüm HTML etiketlerini temizle
    const text = this.stripHtml(htmlContent);

    // Metni kelimelere böl ve boş elemanları filtrele
    // 1. Ham kelimeleri doldur (eski 'words' dizisi, yeni 'rawWords' oldu)
    this.rawWords = text.split(/\s+/).filter(Boolean);
    // 2. Ham kelimeleri kullanarak 'groupedWords' dizisini hesaplat
    this.groupWords();
    
    // DEBUG KODU BAŞLANGICI
    console.log('Temizlenmiş Metin (ilk 200 karakter):', text.substring(0, 200));
    console.log('Toplam Kelime Sayısı:', this.groupedWords.length);
    console.log('İlk 10 Kelime:', this.groupedWords.slice(0, 10));
    // DEBUG KODU SONU

    // Epub.js'i hafızadan temizle
    epubBook.destroy();

    // Başlangıç indeksini ayarla
    this.currentChunkIndex = 0;

    // Eğer kayıtlı ilerleme varsa ve aynı bölümdeyse, oradan devam et
    if (this.book.progress && 
        this.book.progress.chapterHref === chapterHref && 
        this.book.progress.wordIndex !== undefined) {
      // 1. Kayıtlı 'kelime' indeksini al (varsayılan 0)
      const savedWordIndex = this.book.progress.wordIndex || 0;
      // 2. 'kelime' indeksini, mevcut 'grup boyutu'na (chunkSize) bölerek 'grup' (chunk) indeksini hesapla
      this.currentChunkIndex = Math.floor(savedWordIndex / (Number(this.chunkSize) || 1));
    }

    // İlk (veya kaldığı) kelimeyi ayarla
    if (this.groupedWords.length > 0) {
      this.currentChunk = this.groupedWords[this.currentChunkIndex];
      this.updateOrpDisplay();
      
      // DEBUG KODU BAŞLANGICI
      console.log('Başlangıç Indexi:', this.currentChunkIndex);
      console.log('Atanan İlk Kelime:', this.currentChunk);
      // DEBUG KODU SONU
    } else {
      console.error('❌ Kelime dizisi boş!');
    }
  }

  private async loadPastedText(text: string): Promise<void> {
    console.log('📝 Yapıştırılan metin yükleniyor...');
    
    // Metni kelimelere böl ve boş elemanları filtrele
    // 1. Ham kelimeleri doldur (eski 'words' dizisi, yeni 'rawWords' oldu)
    this.rawWords = text.split(/\s+/).filter(Boolean);
    // 2. Ham kelimeleri kullanarak 'groupedWords' dizisini hesaplat
    this.groupWords();
    
    // DEBUG KODU BAŞLANGICI
    console.log('Temizlenmiş Metin (ilk 200 karakter):', text.substring(0, 200));
    console.log('Toplam Kelime Sayısı:', this.groupedWords.length);
    console.log('İlk 10 Kelime:', this.groupedWords.slice(0, 10));
    // DEBUG KODU SONU

    // Başlangıç indeksini ayarla
    this.currentChunkIndex = 0;

    // İlk kelimeyi ayarla
    if (this.groupedWords.length > 0) {
      this.currentChunk = this.groupedWords[this.currentChunkIndex];
      this.updateOrpDisplay();
      
      // DEBUG KODU BAŞLANGICI
      console.log('Başlangıç Indexi:', this.currentChunkIndex);
      console.log('Atanan İlk Kelime:', this.currentChunk);
      // DEBUG KODU SONU
    } else {
      console.error('❌ Kelime dizisi boş!');
      alert('Metin boş veya okunamıyor');
    }
  }

  private stripHtml(html: string): string {
    if (!html) {
      console.warn('⚠️ stripHtml: Boş HTML alındı');
      return '';
    }
    
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  private groupWords(): void {
    // Eğer ham kelime dizimiz yoksa, boş bir gruplanmış dizi ata ve çık.
    if (!this.rawWords || this.rawWords.length === 0) {
      this.groupedWords = [];
      return;
    }

    const chunks: string[] = [];
    // Ayarlardan gelen chunkSize'ı güvenli bir sayıya çevir (varsayılan 1)
    const size = Number(this.chunkSize) || 1;

    // Ham kelimeler dizisini, 'size' (grup boyutu) kadar adımlarla döngüye al
    for (let i = 0; i < this.rawWords.length; i += size) {
      // Diziyi 'i'den 'i + size'a kadar kes, al
      const chunkArray = this.rawWords.slice(i, i + size);
      // Kesilen diziyi 'boşluk' ile birleştirip tek bir string (grup) yap
      const chunk = chunkArray.join(' ');
      // Bu yeni grubu, 'chunks' dizisine ekle
      chunks.push(chunk);
    }

    // Ana 'groupedWords' dizimizi, bu yeni oluşturulan 'chunks' dizisi ile güncelle
    this.groupedWords = chunks;
  }

  goBack(): void {
    if (this.isPlaying) {
      this.stopReading(); // Geri gitmeden önce kaydetmeyi tetikle
    } else {
      this.saveProgress(); // Duraklatılmışsa sadece kaydet
    }
    this.location.back();
  }

  async ngOnDestroy(): Promise<void> {
    // Görev 10.12: Bileşen yok edildiğinde UI gizleme zamanlayıcısını temizle
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    
    // Ayarları kaydet
    // Not: WPM ve fontSize artık her değişiklikte kaydediliyor, burada gereksiz
    // chunkSize onChunkSizeChange'de kaydediliyor
    
    // Görev 9.10: Sayfadan ayrılırken de seansı kaydet
    await this.saveReadingSession();
    
    // Sayfadan ayrılırken (linke tıklama, tarayıcıyı kapatma) kaydet
    if (this.isPlaying) {
      this.stopReading(); // Oynatılıyorsa, durdur ve kaydet
    } else if (this.book) {
      // Duraklatılmışsa, sadece kaydet (stopReading zaten çağrıldı)
      this.saveProgress();
    }
  }

  togglePlay(): void {
    // Replay mantığı: Eğer oynatmaya başlıyorsak VE bölüm bittiyse
    if (!this.isPlaying && this.currentChunkIndex >= this.groupedWords.length - 1) {
      // Bölümü sıfırla
      this.currentChunkIndex = 0;
      this.currentChunk = this.groupedWords[0];
      this.updateOrpDisplay();
    }
    
    if (this.isPlaying) {
      this.stopReading();
    } else {
      this.startReading();
    }
  }

  public onChunkSizeChange(newChunkSizeString: string): void {
    // Gelen string değeri sayıya çevir
    const newChunkSize = Number(newChunkSizeString) || 1;

    // 1. ESKİ chunkSize'ı kullanarak mevcut kelime indeksini hesapla
    const currentFirstWordIndex = this.currentChunkIndex * (Number(this.chunkSize) || 1);

    // 2. Okumayı durdur (eğer çalışıyorsa)
    if (this.isPlaying) {
      this.stopReading();
    }

    // 3. YENİ chunkSize'ı component'in özelliğine ata
    this.chunkSize = newChunkSize;

    // 4. Kelimeleri YENİ chunkSize'a göre yeniden grupla
    this.groupWords();

    // 5. Eski kelime indeksine denk gelen YENİ chunk indeksini hesapla
    let newChunkIndex = Math.floor(currentFirstWordIndex / newChunkSize);

    // 6. Hesaplanan indeksin sınırlar içinde olduğundan emin ol
    newChunkIndex = Math.max(0, Math.min(newChunkIndex, this.groupedWords.length - 1));

    // 7. Yeni indeksi ata
    this.currentChunkIndex = newChunkIndex;

    // 8. Ekrana yeni grubu bas
    if (this.groupedWords.length > 0) {
      this.currentChunk = this.groupedWords[this.currentChunkIndex];
    } else {
      this.currentChunk = '';
    }
    this.updateOrpDisplay();

    // 9. Yeni ayarı kaydet
    this.settingsService.saveChunkSize(this.chunkSize);
  }

  startReading(): void {
    // Eğer bölüm bitmiş ve tekrar başlatılıyorsa, baştan başla
    if (this.currentChunkIndex >= this.groupedWords.length) {
      this.currentChunkIndex = 0;
      this.currentChunk = this.groupedWords[0];
      this.updateOrpDisplay();
    }
    
    // Görev 9.8: Seans takibini başlat (eğer zaten başlamamışsa)
    if (this.sessionStartTime === null) {
      this.sessionStartTime = Date.now();
      // Mevcut 'grup' (chunk) indeksini başlangıç noktası olarak kaydet
      this.sessionStartChunkIndex = this.currentChunkIndex;
    }
    
    this.isPlaying = true;
    this.readingLoop(); // setInterval yerine kendi döngümüzü başlat
  }

  async stopReading(): Promise<void> {
    this.isPlaying = false;
    // setInterval yerine clearTimeout kullanıyoruz
    if (this.readingInterval) {
      clearTimeout(this.readingInterval);
    }
    
    // Görev 9.9: Durdurunca seansı kaydet
    await this.saveReadingSession();
    
    this.saveProgress(); // Kaydetme fonksiyonunu burada çağırıyoruz
  }

  private readingLoop(): void {
    if (!this.isPlaying) {
      return; // Pause'a basıldıysa döngüyü durdur
    }

    // 1. Kelimeyi ilerlet
    this.currentChunkIndex++;

    // 2. Kitap/Bölüm bitti mi kontrol et
    if (this.currentChunkIndex >= this.groupedWords.length) {
      this.stopReading(); // Bitti, durdur ve kaydet
      return;
    }

    // 3. Ekrana yeni kelimeyi bas
    this.currentChunk = this.groupedWords[this.currentChunkIndex];
    this.updateOrpDisplay();

    // 4. BİR SONRAKİ kelimenin hızını, O ANKİ WPM değerine göre ayarla
    const milliseconds = (60 / this.wpm) * 1000;

    // 5. Bir sonraki adımı zamanla
    this.readingInterval = setTimeout(() => {
      this.readingLoop();
    }, milliseconds);
  }

  nextWord(): void {
    // Bu metodun içeriği artık readingLoop içinde,
    // ama hata almamak için boş bırakıyoruz.
  }

  public previousWord(): void {
    if (this.currentChunkIndex > 0) {
      this.currentChunkIndex--;
      this.currentChunk = this.groupedWords[this.currentChunkIndex];
      this.updateOrpDisplay();
    }
  }

  public skipWord(): void {
    if (this.currentChunkIndex < this.groupedWords.length - 1) {
      this.currentChunkIndex++;
      this.currentChunk = this.groupedWords[this.currentChunkIndex];
      this.updateOrpDisplay();
    }
  }

  public increaseWpm(): void {
    if (this.wpm < 1500) {
      this.wpm = Math.min(1500, this.wpm + 25);
      this.settingsService.saveWpm(this.wpm);
    }
  }

  public decreaseWpm(): void {
    if (this.wpm > 100) {
      this.wpm = Math.max(100, this.wpm - 25);
      this.settingsService.saveWpm(this.wpm);
    }
  }

  public onWpmChange(): void {
    // Slider her değiştiğinde WPM'i localStorage'a kaydet
    this.settingsService.saveWpm(this.wpm);
  }

  public onFontSizeChange(): void {
    // Slider her değiştiğinde font boyutunu localStorage'a kaydet
    this.settingsService.saveFontSize(this.fontSize);
  }

  private calculateOrpIndex(word: string): number {
    if (!word) return 0;
    // Ortalamanın biraz solunu hedefleyelim (genellikle daha iyi okunur)
    // Kelime uzunluğunun yaklaşık %40'ı gibi bir indeks.
    // En az 0, en fazla kelime uzunluğu - 1 olmalı.
    const length = word.length;
    const targetIndex = Math.floor(length * 0.4); 
    return Math.max(0, Math.min(targetIndex, length - 1));
  }

  private updateOrpDisplay(): void {
    const chunk = this.currentChunk; // Mevcut grubu al
    if (!chunk) {
      this.chunkBeforeOrp = '';
      this.chunkOrpChar = '';
      this.chunkAfterOrp = '';
      return;
    }

    const orpIndex = this.calculateOrpIndex(chunk);

    this.chunkBeforeOrp = chunk.substring(0, orpIndex);
    this.chunkOrpChar = chunk.substring(orpIndex, orpIndex + 1);
    this.chunkAfterOrp = chunk.substring(orpIndex + 1);
  }

  private async saveProgress(): Promise<void> {
    if (!this.book || !this.currentChapterHref) {
      console.warn('⚠️ Kitap veya bölüm bilgisi yok, ilerleme kaydedilemiyor');
      return;
    }

    // 1. Mevcut 'chunk' indeksini, 'kelime' indeksine geri çevir
    const wordIndex = this.currentChunkIndex * (Number(this.chunkSize) || 1);
    
    // 2. Yeni IBookProgress arayüzüne uygun olarak kaydet
    const progress: IBookProgress = {
      chapterHref: this.currentChapterHref,
      wordIndex: wordIndex
    };

    // İlerleme bilgisini güncelle
    this.book.progress = progress;

    // Veritabanına kaydet
    await this.storageService.updateBookProgress(this.book.id!, progress);

    console.log('✅ Progress saved:', progress);
  }

  public async saveReadingSession(): Promise<void> {
    // 1. Seans başlamadıysa (null ise) veya bu bir "Metin Yapıştır" (kitap değilse) seansıysa, kaydetmeden çık.
    if (this.sessionStartTime === null || !this.book) {
      return;
    }

    // 2. Okunan 'grup' (chunk) sayısını hesapla
    // (Mevcut grup indeksi - seans başladığındaki grup indeksi)
    const chunksRead = this.currentChunkIndex - this.sessionStartChunkIndex;

    // 3. 'Grup' (chunk) sayısını 'kelime' (word) sayısına çevir
    const wordsRead = chunksRead * (Number(this.chunkSize) || 1);

    // 4. Eğer 0 veya daha az kelime okunduysa (örn: 1 saniyeden az 'Play'e basıldıysa),
    // seansı kaydetme, sadece kronometreyi sıfırla.
    if (wordsRead <= 0) {
      this.sessionStartTime = null; // Kronometreyi sıfırla
      return;
    }

    // 5. Kaydedilecek seans nesnesini (IReadingSession) oluştur
    const session: IReadingSession = {
      bookId: this.book.id!,
      startTime: this.sessionStartTime, // Görev 9.8'de ayarlandı
      endTime: Date.now(), // Şimdiki zaman
      wordsRead: wordsRead
    };

    // 6. Veritabanına kaydet (Görev 9.2'de eklediğimiz metodu çağır)
    try {
      await this.storageService.addReadingSession(session);
      console.log('✅ Okuma seansı kaydedildi:', session); // Hata ayıklama (Debug)
    } catch (err) {
      console.error('❌ Okuma seansı kaydedilirken hata:', err);
    } finally {
      // 7. Kronometreyi sıfırla (ÇOK ÖNEMLİ).
      // Bu, 'stopReading' ve 'ngOnDestroy'un aynı seansı iki kez kaydetmesini engeller.
      this.sessionStartTime = null;
    }
  }
}
