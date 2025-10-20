# RapidReads - Hızlı E-Kitap Okuyucu

Bu proje, `.epub` dosyalarını ve yapıştırılan metinleri RSVP (Hızlı Seri Görsel Sunum) tekniğiyle okumak için geliştirilen bir Angular web uygulamasıdır. Tüm veriler (kitaplar ve okuma ilerlemesi) istemci tarafında, IndexedDB kullanılarak saklanır.

## Geliştirme Yol Haritası (GGL)

İlerlemeyi buradan takip et:

### FAZ 0: PROJE KURULUMU VE BAĞIMLILIKLAR

- [x] **Görev 0.1:** Angular CLI Kurulumu
- [x] **Görev 0.2:** Yeni Angular Projesi (`rapid-reads`)
- [x] **Görev 0.3:** Proje Dizinine Girme
- [x] **Görev 0.4:** Tailwind CSS Entegrasyonu
- [x] **Görev 0.5:** `epubjs` ve `dexie` Kurulumu
- [x] **Görev 0.6:** Projeyi Test Etme (`ng serve`)

### FAZ 1: ÇEKİRDEK VERİTABANI SERVİSİ (Storage)

- [x] **Görev 1.1:** `IBook` Model Arayüzü Oluşturma
- [x] **Görev 1.2:** `StorageService` Oluşturma (`ng g s`)
- [x] **Görev 1.3:** `StorageService`'i Dexie.js ile Yapılandırma
- [x] **Görev 1.4:** `addBook` Metodunu Oluşturma
- [x] **Görev 1.5:** `getAllBooks` Metodunu Oluşturma
- [x] **Görev 1.6:** `getBookById` Metodunu Oluşturma
- [x] **Görev 1.7:** `updateBookProgress` Metodunu Oluşturma

### FAZ 2: TEMEL BİLEŞENLER VE YÖNLENDİRME (Routing)

- [x] **Görev 2.1:** Sayfa Bileşenlerini Oluşturma (Library, Reader, Player)
- [x] **Görev 2.2:** Yardımcı Bileşenleri Oluşturma (BookCard, Navbar)
- [x] **Görev 2.3:** Ana Rota (Routing) Yapılandırması
- [x] **Görev 2.4:** Ana `app.component.html`'i Temizleme

### FAZ 3: KÜTÜPHANE SAYFASI (Kitap Yükleme ve Listeleme)

- [x] **Görev 3.1:** `LibraryComponent` (TS) - Kitapları Çekme
- [x] **Görev 3.2:** `LibraryComponent` (HTML) - Kitapları Listeleme
- [x] **Görev 3.3:** `BookCardComponent` (TS ve HTML) - Kart Tasarımı
- [x] **Görev 3.4:** `LibraryComponent` (HTML) - Kitap Yükleme Butonu
- [x] **Görev 3.5:** `LibraryComponent` (TS) - `onFileSelected` Metodu (Epub Yükleme)

### FAZ 4: OKUYUCU SAYFASI (Bölüm Seçimi)

- [x] **Görev 4.1:** `ReaderComponent` (TS) - Kitabı ve Bölümleri Yükleme
- [x] **Görev 4.2:** `ReaderComponent` (HTML) - Bölümleri Listeleme
- [x] **Görev 4.3:** `ReaderComponent` (TS ve HTML) - "Devam Et" Butonu

### FAZ 5: RSVP OYNATICI SAYFASI (Ana Özellik)

- [x] **Görev 5.1:** `PlayerComponent` (TS) - Bölüm Metnini Yükleme ve Ayrıştırma
- [x] **Görev 5.2:** `PlayerComponent` (TS) - RSVP Çekirdek Mantığı (RxJS Timer)
- [x] **Görev 5.3:** `PlayerComponent` (HTML) - Oynatıcı Arayüzü (Play/Pause, Slider)
- [x] **Görev 5.4:** `PlayerComponent` (TS) - İlerlemeyi Kaydetme (`ngOnDestroy`)
- [x] **Görev 5.5:** `PlayerComponent` (TS) - Kayıtlı İlerlemeyle Başlama

### FAZ 6: METİN YAPIŞTIR ÖZELLİĞİ (Bonus)

- [x] **Görev 6.1:** `LibraryComponent`'e "Metin Yapıştır" Butonu Ekleme
- [x] **Görev 6.2:** Metni State ile Player Sayfasına Gönderme

### FAZ 7 (Güncellenmiş): Sürüm 1.0 Parlatma ve Ana Özellikler

Bu faz, MVP'yi alıp kritik kullanıcı deneyimi özellikleri, ayarlar ve erişilebilirlik seçenekleriyle tam bir Sürüm 1.0'a dönüştürmeyi hedefler.

**Alt Faz A: Kitap Silme İşlevi**
- [x] **Görev 7.1 (Service):** `StorageService`'e `deleteBook(id: number): Promise<void>` metodunu ekleme (`db.books.delete(id)` kullanarak).
- [x] **Görev 7.2 (BookCard TS):** `BookCardComponent`'e `@Output() bookDeleted = new EventEmitter<number>();` ekleme.
- [x] **Görev 7.3 (BookCard HTML):** `BookCardComponent`'e (kartın köşesine) "Sil" (Delete) butonu ekleme. Bu buton, tıklandığında `event.stopPropagation()` (kartın tıklanmasını engellemek için) ve `bookDeleted.emit(book.id)` metodunu çağırsın.
- [x] **Görev 7.4 (Library HTML):** `LibraryComponent`'teki `<app-book-card>` etiketini `(bookDeleted)="handleBookDeleted($event)"` event'ini dinleyecek şekilde güncelleme.
- [x] **Görev 7.5 (Library TS):** `LibraryComponent`'e `async handleBookDeleted(bookId: number)` metodu ekleme. Bu metod, `storageService.deleteBook(bookId)`'yi çağırsın ve ardından `this.loadBooks()` ile listeyi güncellesin.

**Alt Faz B: Global Ayarlar (WPM & Font Boyutu)**
- [x] **Görev 7.6 (Service):** Yeni bir `SettingsService` oluşturma (`ng g s core/services/settings --skip-tests`).
- [x] **Görev 7.7 (Service TS):** `SettingsService`'i, `localStorage` kullanarak `saveWpm(wpm: number)`, `loadWpm(): number` (varsayılan 250), `saveFontSize(size: number)`, `loadFontSize(): number` (varsayılan 72) metotlarını içerecek şekilde kodlama.
- [x] **Görev 7.8 (Player TS):** `PlayerComponent`'e `SettingsService`'i inject etme. `ngOnInit`'te `this.wpm = settingsService.loadWpm()` ve `this.fontSize = settingsService.loadFontSize()` metotlarını çağırma.
- [x] **Görev 7.9 (Player TS):** `ngOnDestroy` metodunu, `settingsService.saveWpm(this.wpm)` ve `settingsService.saveFontSize(this.fontSize)` metotlarını çağıracak şekilde güncelleme.
- [x] **Görev 7.10 (Player TS):** `PlayerComponent`'e `fontSize: number = 72;` adında yeni bir özellik ekleme.
- [x] **Görev 7.11 (Player HTML):** "Font Boyutu" için (WPM slider'ının yanına) ikinci bir `<input type="range">` (slider) ekleme ve bunu `[(ngModel)]="fontSize"` ile bağlama.
- [x] **Görev 7.12 (Player HTML):** Kelimeyi gösteren `<h1>` etiketindeki Tailwind sınıflarını (`text-6xl` vb.) silip, `[style.font-size.px]="fontSize"` ile değiştirme.

**Alt Faz C: Okuyucu Kontrolleri (Klavye & Replay)**
- [x] **Görev 7.13 (Player TS):** `PlayerComponent`'e Angular'ın `@HostListener('window:keydown', ['$event'])` özelliğini kullanarak bir `handleKeyboardEvent(event: KeyboardEvent)` metodu ekleme.
- [x] **Görev 7.14 (Player TS):** `handleKeyboardEvent` metodunu şu kısayolları yönetecek şekilde kodlama:
    * `event.code === 'Space'`: `togglePlay()`'i çağırsın (ve sayfanın kaymasını engellesin).
    * `event.code === 'ArrowLeft'`: Yeni bir `previousWord()` metodunu çağırsın (index'i bir azaltır).
    * `event.code === 'ArrowRight'`: Yeni bir `skipWord()` metodunu çağırsın (index'i bir artırır).
    * `event.code === 'ArrowUp'`: Yeni bir `increaseWpm()` metodunu çağırsın (WPM'i 25 artırır).
    * `event.code === 'ArrowDown'`: Yeni bir `decreaseWpm()` metodunu çağırsın (WPM'i 25 azaltır).
- [x] **Görev 7.15 (Player TS):** `togglePlay()` (veya `startReading()`) metodunu, `currentWordIndex` dizinin sonuna ulaştıysa (`>= words.length`) ve kullanıcı tekrar 'Play'e bastıysa, `this.currentWordIndex = 0;` yaparak bölümü baştan başlatacak şekilde güncelleme.

**Alt Faz D: Gece Modu (Dark Mode)**
- [x] **Görev 7.16 (Tailwind Config):** `tailwind.config.js` dosyasını `darkMode: 'class'` stratejisini kullanacak şekilde güncelleme.
- [x] **Görev 7.17 (Service):** Yeni bir `ThemeService` oluşturma (`ng g s core/services/theme --skip-tests`).
- [x] **Görev 7.18 (Service TS):** `ThemeService`'i, `localStorage`'da 'theme' ('dark'/'light') tercihini saklayacak ve `document.documentElement.classList` (`.add('dark')` / `.remove('dark')`) listesini güncelleyecek şekilde kodlama.
- [x] **Görev 7.19 (Navbar TS/HTML):** `NavbarComponent`'e `ThemeService`'i kullanan bir "Gece Modu" (Ay/Güneş ikonu) düğmesi ekleme.
- [x] **Görev 7.20 (Stil):** `LibraryComponent`, `PlayerComponent` ve `BookCardComponent` HTML dosyalarını `dark:bg-gray-800`, `dark:text-white` gibi `dark:` Tailwind sınıflarıyla güncelleme.

### FAZ 8 (Yeni): UX İyileştirmeleri (Arama ve Uyarılar)

Bu faz, Sürüm 1.0'ın kullanıcı deneyimini, kütüphane arayüzünü daha akıllı hale getirerek ve kritik eylemler (silme, çift kayıt) için uyarı mekanizmaları ekleyerek sağlamlaştırmayı hedefler.

**Alt Faz A: Kütüphanede Arama (Yazar Desteği ile TAMAMLANDI)**
- [x] **Görev 8.0 (Model):** `IBook` interface'ine `author?: string` field'ı ekleme.
- [x] **Görev 8.0.1 (Database):** Database version 2'ye yükseltme ve `author` field'ını index'e ekleme.
- [x] **Görev 8.0.2 (Library TS):** `onFileSelected` metodunda EPUB'dan `metadata.creator` ile yazar bilgisini çekme.
- [x] **Görev 8.1 (Library HTML):** `LibraryComponent`'in HTML'ine (başlığın yanına), `[(ngModel)]="searchTerm"` ile bağlı, Tailwind ile stil verilmiş bir "Arama" `<input>` alanı ekleme.
- [x] **Görev 8.2 (Library TS):** `LibraryComponent`'in modülüne (`library.component.ts`'in `@Component` dekoratörüne) `imports: [FormsModule, ...]` ekleyerek `FormsModule`'ü import etme. (Eğer `LibraryComponent` `standalone: true` değilse, `library.module.ts`'e eklenmeli).
- [x] **Görev 8.3 (Library TS):** `LibraryComponent`'e `searchTerm: string = '';` ve `filteredBooks: IBook[] = [];` adında yeni özellikler ekleme.
- [x] **Görev 8.4 (Library TS):** `ngOnInit`'te `loadBooks()`'tan sonra `this.filteredBooks = this.books;` ataması yapma.
- [x] **Görev 8.5 (Library TS):** `(ngModelChange)`'e bağlanacak `filterBooks()` adında bir metod ekleme. Bu metod, `this.books` dizisini `this.searchTerm`'e göre (küçük harfe çevirerek) hem **başlık** hem de **yazar adı** üzerinden filtrelesin ve sonucu `this.filteredBooks`'a atasın.
- [x] **Görev 8.6 (Library HTML):** `*ngFor` döngüsünü `books` yerine `filteredBooks` dizisini kullanacak şekilde güncelleme.

**Alt Faz B (Revize Edilmiş): Global Bildirim (Toast) Sistemi - TAMAMLANDI**

**Ön Hazırlık: Geri Alma (Undo)**
- [x] **Görev 8.8 (Geri Al):** `library.component.ts` dosyasını aç. `alertMessage: string | null = null;` ve `alertType: 'success' | 'error' = 'success';` özelliklerini sil.
- [x] **Görev 8.9 (Geri Al):** `library.component.html` dosyasını aç. `*ngIf="alertMessage"` ile başlayan `div` bloğunun tamamını (uyarı kutusu) sil.

**(1) Altyapıyı Kurma (Toast Service ve Component)**
- [x] **Görev 8.11 (Yeni):** Yeni bir `ToastService` oluşturma (`ng g s core/services/toast --skip-tests`).
- [x] **Görev 8.12 (Yeni):** Yeni bir `ToastComponent` oluşturma (`ng g c shared/components/toast --skip-tests`).
- [x] **Görev 8.13 (Service TS):** `ToastService`'i (`toast.service.ts`) kodlama:
    * RxJS'ten `Subject` import etme.
    * `public toastEvents = new Subject<ToastEvent>();` adında bir Subject oluşturma. (Bunun için `ToastEvent` adında bir interface: `{ message: string, type: 'success' | 'error' }`).
    * `public show(message: string, type: 'success' | 'error' = 'success')` adında bir metod ekleme. Bu metod, `this.toastEvents.next({ message, type });` komutunu çağırsın.
- [x] **Görev 8.14 (Component TS):** `ToastComponent`'i (`toast.component.ts`) kodlama:
    * `ToastService`'i inject etme.
    * `toasts: ToastEvent[] = [];` adında bir dizi tanımlama.
    * `ngOnInit`'te `toastService.toastEvents.subscribe(...)` ile servisi dinleme.
    * Yeni bir event geldiğinde, bunu `this.toasts` dizisine `push` etme ve `setTimeout` ile 3 saniye sonra diziden kaldırma (`this.toasts.shift()` veya `filter`).
- [x] **Görev 8.15 (Component HTML):** `toast.component.html`'i kodlama:
    * Ana kapsayıcıyı Tailwind ile ekranın sağ üst köşesine sabitleme (`fixed top-5 right-5 z-50`).
    * `*ngFor="let toast of toasts"` ile `toasts` dizisi üzerinde dönme.
    * Her bir toast için, `[ngClass]` kullanarak `toast.type`'a göre yeşil (`bg-green-600`) veya kırmızı (`bg-red-600`) renkte, `text-white p-4 rounded-md shadow-lg mb-2` stillerine sahip bir kutu gösterme.
- [x] **Görev 8.16 (App HTML):** `ToastComponent`'i her sayfada gösterme:
    * `app.component.html` dosyasını aç.
    * `<router-outlet>`'in üstüne veya altına `<app-toast></app-toast>` bileşenini ekle.

**(2) Yeni Sistemi Kullanma**
- [x] **Görev 8.17 (Library TS):** `LibraryComponent`'in (`library.component.ts`) constructor'ına `ToastService`'i `private toastService: ToastService` olarak inject etme.
- [x] **Görev 8.18 (Library TS):** `onFileSelected` metodunu güncelleme:
    * "Kitap zaten mevcut" hatası durumunda, `this.alertMessage = ...` satırını silip, `this.toastService.show(\`'${title}' adlı kitap zaten kütüphanenizde mevcut.\`, 'error');` ile değiştirme.
    * "Kitap başarıyla eklendi" durumunda, `this.alertMessage = ...` ve `setTimeout` satırlarını silip, `this.toastService.show(\`'${title}' başarıyla eklendi.\`, 'success');` ile değiştirme.
    * "Hata oluştu" (catch bloğu) durumunda, `this.alertMessage = ...` satırını silip, `this.toastService.show('Kitap yüklenirken bir hata oluştu.', 'error');` ile değiştirme.

**(3) Silme Onay Modalı - TAMAMLANDI**
- [x] **Görev 8.19 (Modal Component):** `AlertModalComponent`'i oluşturma (`ng g c shared/components/alert-modal --skip-tests`).
- [x] **Görev 8.20 (Modal TS):** `AlertModalComponent`'i `@Input() message`, `@Output() onConfirm`, `@Output() onCancel` ile kodlama.
- [x] **Görev 8.21 (Modal HTML):** Modal arayüzünü tam ekran overlay, beyaz kutu, İptal/Sil butonları ile tasarlama.
- [x] **Görev 8.22 (Library TS):** `LibraryComponent`'e `bookToDelete: IBook | null = null;` property'si ekleme.
- [x] **Görev 8.23 (Library TS):** `handleBookDeleted()` metodunu `askForDelete(book: IBook)` olarak değiştirme.
- [x] **Görev 8.24 (Library TS):** `confirmDelete()` metodu ekleme (silme + toast + modal kapatma + liste güncelleme).
- [x] **Görev 8.25 (Library HTML):** `<app-alert-modal>` bileşenini ekleme ve event binding'lerini yapma.
- [x] **Görev 8.26 (Library HTML):** `(bookDeleted)` event'ini `askForDelete(book)` çağıracak şekilde güncelleme.
- [x] **Görev 8.27 (BookCard):** `bookDeleted` EventEmitter'ın tipini `number`'dan `IBook`'a değiştirme.
- [x] **Görev 8.28 (BookCard):** `onDelete()` metodundan `confirm()` dialogunu kaldırma ve book nesnesini emit etme.

Bu faz, Sürüm 1.0 üzerine, en yüksek değerli iki iyileştirmeyi eklemeyi hedefler: Kütüphane kullanışlılığı ve çekirdek okuma kalitesi.

**Alt Faz A: Kütüphanede Arama (TAMAMLANDI)**
- [x] **Görev 8.1 (Library HTML):** `LibraryComponent`'in HTML'ine (başlığın yanına), `[(ngModel)]="searchTerm"` ile bağlı bir "Arama" `<input>` alanı ekleme. (Bunun için `FormsModule`'ün `LibraryComponent`'in modülüne import edilmesi gerekebilir - veya `(input)` event'i kullanalım).
- [x] **Görev 8.2 (Library TS):** `LibraryComponent`'e `searchTerm: string = '';` ve `filteredBooks: IBook[] = [];` adında yeni özellikler ekleme.
- [x] **Görev 8.3 (Library TS):** `ngOnInit`'te `loadBooks()`'tan sonra `this.filteredBooks = this.books;` ataması yapma.
- [x] **Görev 8.4 (Library TS):** `(input)` event'ine (veya `ngModelChange`'e) bağlanacak `filterBooks()` adında bir metod ekleme. Bu metod, `this.books` dizisini `this.searchTerm`'e göre (küçük harfe çevirerek) filtrelesin ve sonucu `this.filteredBooks`'a atasın.
- [x] **Görev 8.5 (Library HTML):** `*ngFor` döngüsünü `books` yerine `filteredBooks` dizisini kullanacak şekilde güncelleme.

**Alt Faz B: "Chunking" (Kelime Gruplama) - TAMAMLANDI**
- [x] **Görev 8.6 (Settings Service):** `SettingsService`'e `saveChunkSize(size: number)` ve `loadChunkSize(): number` (varsayılan 1) metotları ekleme (`localStorage` kullanarak).
- [x] **Görev 8.7 (Player TS):** `PlayerComponent`'e `chunkSize: number = 1;` özelliği ekleme ve `ngOnInit`'te `settingsService.loadChunkSize()` ile yükleme. `ngOnDestroy`'da `saveChunkSize()`'ı çağırma.
- [x] **Görev 8.8 (Player HTML):** Kontrol paneline "Grup Boyutu" (1, 2, 3) için yeni bir slider ekleme ve bunu `[(ngModel)]="chunkSize"` ile bağlama.
- [x] **Görev 8.9 (Player TS - Refactor):** `words` → `rawWords`, `groupedWords` dizisi ekleme. `currentWordIndex` → `currentChunkIndex`, `currentWord` → `currentChunk` yeniden adlandırma.
- [x] **Görev 8.10 (Player TS - groupWords):** `groupWords()` private metodunu ekleme (rawWords'ü chunkSize'a göre gruplama).
- [x] **Görev 8.11 (Player TS - loadChapter):** `loadChapter` ve `loadPastedText` metotlarında `groupWords()` çağrısı ekleme.
- [x] **Görev 8.12 (Player TS - onChunkSizeChange):** Chunk size değiştiğinde re-grouping ve reset yapan metod ekleme.
- [x] **Görev 8.13 (Player HTML):** Chunk size slider'a `(ngModelChange)` event'i bağlama.

**Alt Faz C: Progress Sistemini Chunk-Based Hale Getirme - TAMAMLANDI**
- [x] **Görev 8.14 (Book Model):** `IBookProgress` interface ekleme ve `progress?: IBookProgress` tipini güncelleme.
- [x] **Görev 8.15 (Player TS - saveProgress):** Progress'i chunk index'ten word index'e dönüştürerek kaydetme.
- [x] **Görev 8.16 (Player TS - loadChapter):** Kayıtlı word index'i chunk index'e dönüştürerek yükleme.

### FAZ 9: VERİ VE İSTATİSTİK ALTYAPISI - TAMAMLANDI ✅

Bu faz, uygulamayı "akıllı" hale getirmeyi hedefler. Kitapların toplam kelime sayısını hesaplayarak ilerleme çubukları ekledik ve okuma seanslarını kaydederek bir istatistik sayfası oluşturduk.

**Alt Faz A: Veritabanı Güncelleme (Migration) ve Kelime Sayımı - TAMAMLANDI**
- [x] **Görev 9.1 (Model):** `IBook` arayüzüne (`book.model.ts`) `totalWords?: number;` (opsiyonel) adında yeni bir özellik ekleme.
- [x] **Görev 9.2 (Service DB):** `StorageService`'i (`storage.service.ts`) `version(3)`'e yükseltme:
    a.  `version(2)`'nin altına `version(3).stores({ books: '++id, &title, author, totalWords' })` satırını ekleme.
    b.  `readingSessions` adında *yeni bir tablo* için `IReadingSession` arayüzü (`id?`, `bookId`, `startTime`, `endTime`, `wordsRead`) ve Dexie `Table` özelliği tanımlama.
    c.  `version(3)`'ün `stores` tanımına `readingSessions: '++id, bookId, startTime'` ekleme.
    d.  `StorageService`'e `addReadingSession(session: IReadingSession)` adında yeni bir metod ekleme.
- [x] **Görev 9.3 (Library TS):** `onFileSelected` metodunu (`library.component.ts`) güncelleme:
    a.  Kitap yükleme (`epubBook = ePub(file)`) mantığını, kitabın *tüm* bölümlerini (`epubBook.spine`) döngüye alacak şekilde genişletme.
    b.  Her bölümün metnini `section.load()` ve `stripHtml()` ile çekip, `split().filter(Boolean)` ile kelimelerini sayma.
    c.  Tüm bölümlerin kelime sayılarını toplayıp `totalWords` adında bir değişkene atama.
    d.  `newBook` nesnesini (IndexedDB'ye kaydetmeden önce) `totalWords: totalWords` özelliğini içerecek şekilde güncelleme.
    *(Not: Bu, kitap yüklemeyi birkaç saniye yavaşlatacak normal bir işlemdir.)*

**Alt Faz B: Kitap İlerleme Çubuğu (Progress Bar) - TAMAMLANDI**
- [x] **Görev 9.4 (BookCard TS):** `BookCardComponent`'e `progressPercentage` getter'ı ekleme (property yerine getter kullanıldı - otomatik hesaplama için).
- [x] **Görev 9.5 (BookCard TS):** `progressPercentage` getter'ında, `book.progress.wordIndex` ve `book.totalWords` kullanarak yüzde hesaplama (OnInit kaldırıldı).
- [x] **Görev 9.6 (BookCard HTML):** `BookCardComponent`'in inline template'ine, kartın en altında, Tailwind ile stil verilmiş ince bir ilerleme çubuğu ekleme (yüzde metni ile birlikte).
- [x] **Görev 9.6b (Library TS):** `LibraryComponent`'e `router.events` dinleyicisi ekleme (NavigationEnd ile sayfa refresh - progress bar'lar otomatik güncelleniyor).

**Alt Faz C: Okuma Seanslarını Kaydetme - TAMAMLANDI**
- [x] **Görev 9.7 (Player TS):** `PlayerComponent`'e `sessionStartTime: number | null = null;` ve `sessionStartChunkIndex: number = 0;` adında yeni özellikler ekleme (chunk-based sistem için güncellendi).
- [x] **Görev 9.8 (Player TS):** `startReading()` metodunu güncelleme: Eğer `sessionStartTime === null` ise `Date.now()` ve `currentChunkIndex`'i kaydetme (Pause/Play ile tekrar başlamayı destekler).
- [x] **Görev 9.9 (Player TS):** `stopReading()` metodunu async yapma ve `await this.saveReadingSession();` çağrısını ekleme (Pause/Stop durumlarında session kaydetme).
- [x] **Görev 9.10 (Player TS):** `ngOnDestroy`'u async yapma ve `await this.saveReadingSession();` çağrısını ekleme (sayfadan ayrılırken session kaydetme).
- [x] **Görev 9.11 (Player TS):** `async saveReadingSession(): Promise<void>` metodu ekleme:
    - Chunk-based sistem için `chunksRead * chunkSize` ile `wordsRead` hesaplama.
    - `wordsRead > 0` kontrolü ile anlamsız sessionları filtreleme.
    - `IReadingSession` nesnesi oluşturma ve `storageService.addReadingSession()` ile kaydetme.
    - `finally` bloğunda `sessionStartTime = null` ile tekrar kaydetmeyi engelleme.

**Alt Faz D: İstatistik Sayfası - TAMAMLANDI**
- [x] **Görev 9.12 (Component):** Yeni bir `StatsPageComponent` oluşturma (`ng g c pages/stats --skip-tests`).
- [x] **Görev 9.13 (Routing):** `app.routes.ts`'e `/stats` yolunu (route) ekleme ve `NavbarComponent`'e "İstatistikler" linki ekleme.
- [x] **Görev 9.14 (Service):** `StorageService`'e `getAllReadingSessions(): Promise<IReadingSession[]>` metodu ekleme.
- [x] **Görev 9.15 (Stats TS):** `StatsPageComponent`'i (`stats.ts`), `ngOnInit`'te `storageService.getAllReadingSessions()`'ı çağıracak ve dönen veriyi işleyecek şekilde kodlama (Toplam okuma süresi, Toplam kelime sayısı, Ortalama WPM hesaplama).
- [x] **Görev 9.16 (Stats HTML):** `StatsPageComponent`'in template'ini (`stats.html`), bu hesaplanan istatistikleri (Ortalama Hız, Toplam Süre, Toplam Kelime, Toplam Seans) Tailwind kartları içinde gösterecek şekilde tasarlama.

### FAZ 9.5: ACİL DÜZELTMELER (Post-FAZ 9)

FAZ 9 tamamlandıktan sonra tespit edilen kritik hatalar bu ara fazda düzeltildi.

- [x] **Düzeltme 9.5.1 (WPM):** `SettingsService.loadWpm()` metodunun varsayılan dönüş değerinin `250` olması ve `NaN` kontrolü yapması sağlandı.
- [x] **Düzeltme 9.5.2 (Progress %0):**
    a.  `BookCardComponent`'teki `progressPercentage` hesaplaması, `ngOnInit` yerine `public get` (getter) içine taşındı.
    b.  `LibraryComponent`'e `Router Events` (`NavigationEnd`) dinleyicisi eklenerek, sayfaya her geri dönüldüğünde `loadBooks()`'un tekrar çağrılması sağlandı (progress bar'ların güncellenmesi için).
- [x] **Düzeltme 9.5.3 (Header Boyutu):** `NavbarComponent`'teki `<h1>` başlığının ve ikonların Tailwind `text-2xl` sınıfı `text-xl` (veya `text-lg`) olarak küçültüldü.

### FAZ 10: UI İYİLEŞTİRMELERİ - TAMAMLANDI ✅

Bu faz, uygulamanın genel kullanıcı deneyimini, navigasyon kolaylığı, okuyucu odaklanması ve görsel tutarlılık gibi alanlarda parlatmayı hedefler.

**Alt Faz A: Geri Dönüş Butonları** - TAMAMLANDI ✅
- [x] **Görev 10.1 (Stats TS):** `StatsPageComponent`'e (`stats.component.ts`) `@angular/common`'dan `Location` servisini inject etme (`private location: Location`).
- [x] **Görev 10.2 (Stats TS):** `StatsPageComponent`'e `public goBack(): void` adında bir metod ekleme. Bu metod, `this.location.back()` komutunu çağırsın.
- [x] **Görev 10.3 (Stats HTML):** `StatsPageComponent`'in HTML'ine (`stats.component.html`), `<h1>İstatistiklerim</h1>` başlığının hemen altına (veya üstüne), Tailwind ile stil verilmiş (örn: sol ok ikonu "<" içeren, küçük, gri bir buton) bir "Geri" butonu ekleme. Bu buton `(click)="goBack()"` metodunu çağırsın.
- [x] **Görev 10.4 (Reader TS):** `ReaderComponent`'e (`reader.component.ts`) `@angular/common`'dan `Location` servisini inject etme (`private location: Location`).
- [x] **Görev 10.5 (Reader TS):** `ReaderComponent`'e `public goBack(): void` adında bir metod ekleme (eğer zaten yoksa). Bu metod, `this.location.back()` komutunu çağırsın.
- [x] **Görev 10.6 (Reader HTML):** `ReaderComponent`'in HTML'ine (`reader.component.html`), `<h1>{{ book?.title }}</h1>` başlığının hemen altına (veya üstüne), Tailwind ile stil verilmiş benzer bir "Geri" butonu ekleme. Bu buton `(click)="goBack()"` metodunu çağırsın.

**Alt Faz B: Okuyucuda Otomatik UI Gizleme (Immersive Mode)** - TAMAMLANDI ✅
- [x] **Görev 10.7 (Player TS):** `PlayerComponent`'e `isUiVisible: boolean = true;` adında yeni bir public özellik ekleme.
- [x] **Görev 10.8 (Player TS):** `PlayerComponent`'e `idleTimeout: any;` adında private bir özellik ekleme (timeout ID'sini tutmak için).
- [x] **Görev 10.9 (Player TS):** `@HostListener('document:mousemove')` ve `@HostListener('document:touchstart')` kullanarak fare veya dokunma hareketini algılayan bir `showUiTemporarily()` metodu ekleme.
- [x] **Görev 10.10 (Player TS):** `showUiTemporarily()` metodunun içine:
    a.  `this.isUiVisible = true;` yapma.
    b.  Mevcut `idleTimeout`'u `clearTimeout()` ile temizleme.
    c.  Yeni bir `setTimeout(() => { this.isUiVisible = false; }, 3000);` (3 saniye sonra UI'ı gizle) ayarlama ve ID'sini `this.idleTimeout`'a kaydetme.
- [x] **Görev 10.11 (Player TS):** `ngOnInit`'te ilk `showUiTemporarily()` çağrısını yapma (başlangıçta UI görünsün ve timeout başlasın).
- [x] **Görev 10.12 (Player TS):** `ngOnDestroy`'da `clearTimeout(this.idleTimeout);` çağrısını yapma (bileşen yok edildiğinde timeout'u temizle).
- [x] **Görev 10.13 (Player HTML):** `player.component.html`'deki "Geri" ve "Kütüphaneye Dön" butonlarını/linklerini içeren *üst* bölümü (veya `app-navbar`'ı etkiliyorsa onu) ve *alt* kontrol panelini (`<input type="range">`'leri içeren `div`) `[ngClass]` ile sarmalama. Bu `ngClass`, `isUiVisible` `false` olduğunda `opacity-0 pointer-events-none transition-opacity duration-300` gibi Tailwind sınıflarını eklesin, `true` olduğunda `opacity-100` yapsın.

**Alt Faz C: Genel Stil Parlatma** - TAMAMLANDI ✅
- [x] **Görev 10.14 (İkon Kütüphanesi):** Projeye bir SVG ikon kütüphanesi ekleme (`@fortawesome/angular-fontawesome` kullanıldı).
- [x] **Görev 10.15 (İkon Entegrasyonu):** `NavbarComponent` (Gece Modu), `BookCardComponent` (Sil), `PlayerComponent` (Play/Pause, Geri) ve `StatsPageComponent`/`ReaderComponent` (Geri) butonlarına metin yerine Font Awesome ikonları eklendi.
- [x] **Görev 10.16 (Tipografi ve Boşluk):** Uygulama genelinde başlık boyutları, paragraf metinleri (Stats light mode rengi), grid gap tutarlılığı ve genel font ailesi (`font-sans`) ayarları yapıldı.
- [x] **Görev 10.17 (Animasyonlar):** Toast bildirimleri ve Modal açılışı için entry animasyonları (`animate-toast-in`, `animate-modal-in`) ve tüm butonlara hover efektleri (`hover:scale-105`, `transition duration-150`) eklendi.

### FAZ 10 (Revize Edilmiş): Stil Altyapısı ve Kritik UI Parlatma

Bu faz, uygulamanın genel UI/UX kalitesini, merkezi bir stil altyapısı kurarak, temel bileşenleri yeniden şekillendirerek ve erişilebilirliği artırarak profesyonel bir seviyeye taşımayı hedefler.

**Alt Faz A: Global Stil Altyapısı** - TAMAMLANDI ✅
- [x] **Görev 10.1 (styles.scss):** `@layer components` içinde `.btn`, `.btn-primary`, `.btn-danger`, `.btn-ghost`, `.input`, `.card` gibi temel UI bileşenleri için yeniden kullanılabilir Tailwind stilleri tanımla.
- [x] **Görev 10.2 (styles.scss):** Genel `font-sans` font ailesini `body` etiketine `@apply` ile uygula. (Ayrıca varsayılan metin ve arka plan renkleri de eklendi: `text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900`)
- [x] **Görev 10.3 (styles.scss/tailwind.config):** Tutarlı bir `focus-visible` stilini (örn: `ring-2 ring-offset-2 ring-blue-500`) tanımla ve mümkünse `@layer base` kullanarak tüm interaktif elemanlara varsayılan olarak uygula.
- [x] **Görev 10.4 (tailwind.config):** Tailwind yapılandırmasında, uygulama genelinde kullanılacak tutarlı renk (`brand`, `surface`, `content`, `danger`, `success`) ve gölge (`shadow`, `shadow-md`, `shadow-lg`, `shadow-inner`) token'larını (değişkenlerini) tanımla.

**Alt Faz B: Navbar Refactoring** - TAMAMLANDI ✅
- [x] **Görev 10.5 (Navbar TS/HTML):** `NavbarComponent`'teki inline CSS (`styles: [...]`) kaldırıldı ve tamamen Tailwind sınıflarına geçildi (`.btn-ghost`, `container mx-auto` vb.).
- [x] **Görev 10.6 (Navbar HTML):** Navbar'a `sticky top-0 z-40` sınıfları eklendi, modern ve yapışkan bir görünüm kazandırıldı. (backdrop-blur opsiyonel olarak kullanılmadı)
- [x] **Görev 10.7 (Navbar HTML):** "İstatistikler" linkine Font Awesome ikonu (`faChartLine`) eklendi. `routerLinkActive="bg-gray-700"` kullanılarak aktif link vurgulandı.

**Alt Faz C: Player Okuma Alanı İyileştirmeleri** - TAMAMLANDI ✅
- [x] **Görev 10.8 (Player HTML):** Okuma alanındaki (`currentChunk`'ı gösteren `div`) fontu `font-serif` olarak zaten vardı. `leading-none` ve `tracking-wide` sınıfları eklendi. Dark mode kontrastı zaten uygun (`text-gray-800 dark:text-white`).
- [x] **Görev 10.9 (Player TS/HTML):** ORP (Optimal Recognition Point) özelliği eklendi. `calculateOrpIndex()` ve `updateOrpDisplay()` metotları ile kelimenin %40'ında ORP harfi turuncu renkle vurgulanıyor (`chunkBeforeOrp`, `chunkOrpChar`, `chunkAfterOrp`).
- [x] **Görev 10.10 (Player HTML):** Alt kontrol panelindeki Play/Pause butonu `.btn` stiliyle güncellendi (yeşil renklerle). Slider'lar dark mode desteği ile iyileştirildi (`dark:bg-gray-700`). Label'lar `text-sm text-gray-500` ile daha zarif görünüyor.

**Alt Faz D: Kütüphane Kartı ve Buton Stilleri** - TAMAMLANDI ✅
- [x] **Görev 10.11 (BookCard HTML):** Kitap başlığı `line-clamp-2` ile 2 satıra sınırlandı. `book.author` için yeni `<p>` etiketi eklendi (`text-sm text-gray-500 dark:text-gray-400`). Progress bar `h-1` olarak inceltildi ve yüzde metni yan yana flex layout'ta gösteriliyor (`w-5 text-right`). `@tailwindcss/line-clamp` plugin'i kuruldu.
- [x] **Görev 10.12 (BookCard HTML):** Sil butonu `.btn-ghost` ve `.btn-ghost-danger` sınıflarını kullanıyor (kırmızı renk ve hover efektleri otomatik).
- [x] **Görev 10.13 (Library HTML):** "Kitap Yükle" butonu `.btn-primary`, "Metin Yapıştır" butonu yeni `.btn-success` (yeşil) stilini kullanıyor. Başlık, arama ve butonlar `flex flex-col md:flex-row` ile responsive layout'ta. Arama input'u `.input` sınıfını kullanıyor.

**Alt Faz E: Toast & Modal Erişilebilirlik ve Stil** - TAMAMLANDI ✅
- [x] **Görev 10.14 (Toast/Modal HTML):** `ToastComponent`'e `role="status" aria-live="polite"` eklendi. `AlertModalComponent`'e `role="dialog" aria-modal="true" aria-labelledby="alert-dialog-title"` ve gizli `<h2>` başlığı (`sr-only`) eklendi.
- [x] **Görev 10.15 (styles.scss/tailwind.config):** `toast-in` ve `modal-in` `keyframes` animasyonları `tailwind.config.js`'den kaldırılıp `styles.scss`'e taşındı. `@layer utilities` ile `.animate-toast-in` ve `.animate-modal-in` sınıfları tanımlandı.
- [x] **Görev 10.16 (Toast/Modal HTML):** Modal'daki İptal butonu `.btn-ghost`, Sil butonu `.btn-danger` kullanıyor. Library modal'ındaki butonlar da `.btn-ghost` ve `.btn-success` ile güncellendi.
- [x] **Görev 10.17 (İnce Ayar):** İkon butonlara (`Navbar`, `BookCard`, `Player` vb.) fare üzerine gelince açıklama gösteren basit `title="..."` attribute'ları eklendi (Navbar'da "Tema Değiştir" ve "İstatistiklerinizi görüntüleyin", BookCard'da "Kitabı Sil" vb. zaten mevcut). Dark mode renk kontrastları uygun.