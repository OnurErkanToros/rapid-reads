import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import ePub from 'epubjs';
import { StorageService } from '../../core/services/storage.service';
import { ToastService } from '../../core/services/toast';
import { IBook } from '../../core/models/book.model';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal';

@Component({
  selector: 'app-library',
  imports: [CommonModule, FormsModule, BookCardComponent, AlertModalComponent],
  templateUrl: './library.html',
  styleUrl: './library.scss'
})
export class Library implements OnInit, OnDestroy {
  books: IBook[] = [];
  filteredBooks: IBook[] = [];
  showPasteModal: boolean = false;
  searchTerm: string = '';
  public bookToDelete: IBook | null = null;
  private routerSubscription?: Subscription;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    
    // Sayfaya her geri dönüldüğünde verileri tazele
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/')
      )
      .subscribe(() => {
        // Veritabanından en güncel kitap listesini çek
        console.log('📚 Library: NavigationEnd detected, reloading books...');
        this.loadBooks();
      });
  }

  ngOnDestroy(): void {
    // Memory leak önlemek için subscription'ı temizle
    this.routerSubscription?.unsubscribe();
  }

  async loadBooks(): Promise<void> {
    console.log('📚 Library: Loading books from IndexedDB...');
    this.books = await this.storageService.getAllBooks();
    console.log(`📚 Library: Loaded ${this.books.length} books`);
    this.filterBooks();
  }

  public filterBooks(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredBooks = this.books;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(term) ||
      (book.author && book.author.toLowerCase().includes(term))
    );
  }

  askForDelete(book: IBook): void {
    this.bookToDelete = book;
  }

  async confirmDelete(): Promise<void> {
    if (!this.bookToDelete) return; // Güvenlik kontrolü
    
    try {
      await this.storageService.deleteBook(this.bookToDelete.id!);
      await this.loadBooks(); // Listeyi güncelle
      this.toastService.show(`'${this.bookToDelete.title}' başarıyla silindi.`, 'success');
    } catch (err) {
      this.toastService.show('Kitap silinirken bir hata oluştu.', 'error');
    } finally {
      this.bookToDelete = null; // Modalı kapat
    }
  }

  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    
    if (!file) {
      console.error('Dosya seçilmedi');
      return;
    }

    if (file.type !== 'application/epub+zip') {
      console.error('Sadece EPUB dosyaları yüklenebilir');
      this.toastService.show('Lütfen geçerli bir EPUB dosyası seçin', 'error');
      return;
    }

    try {
      // Dosyayı ArrayBuffer'a çevir
      const arrayBuffer = await file.arrayBuffer();
      
      // EPUB dosyasını yükle
      const book = ePub(arrayBuffer);
      
      // Metadata'yı al
      const metadata = await book.loaded.metadata;
      
      // Spine'ın yüklenmesini garanti altına al
      await book.ready;
      
      // Çift Kayıt Kontrolü
      const title = metadata.title || 'Başlıksız';
      const existingBook = await this.storageService.getBookByTitle(title);
      if (existingBook) {
        this.toastService.show(`'${title}' adlı kitap zaten kütüphanenizde mevcut.`, 'error');
        book.destroy();
        (event.target as HTMLInputElement).value = ''; // File input'u sıfırla
        return;
      }
      
      // YENİ GÖREV 9.3: Toplam Kelime Sayısını Hesapla
      let totalWords = 0;
      try {
        // Spine içindeki tüm section'ları al (epub.js için alternatif yöntem)
        const spine = book.spine;
        const flowItems: any[] = [];
        
        // Spine'ı iterate ederek tüm item'ları topla
        spine.each((item: any) => {
          if (item && item.href) {
            flowItems.push(item);
          }
        });
        
        // Her bölümü asenkron olarak işle
        for (const section of flowItems) {
          try {
            // Bölümün HTML içeriğini yükle
            const loadedSection = book.spine.get(section.href);
            if (loadedSection) {
              const contents = await loadedSection.load(book.load.bind(book));
              let htmlContent = '';
              
              if (typeof contents === 'string') {
                htmlContent = contents;
              } else if (contents?.documentElement?.innerHTML) {
                htmlContent = contents.documentElement.innerHTML;
              } else if ((contents as any)?.innerHTML) {
                htmlContent = (contents as any).innerHTML;
              }
              
              // HTML'i temizle
              const text = this.stripHtml(htmlContent);
              // Kelimeleri say
              const wordCount = text.split(/\s+/).filter(Boolean).length;
              console.log(`Bölüm taranıyor: ${section.href}, Kelime Sayısı: ${wordCount}`);
              totalWords += wordCount;
            }
          } catch (sectionError) {
            console.warn('Bölüm işlenemedi:', section.href, sectionError);
          }
        }
        
        console.log('Tüm bölümler tarandı. Toplam Kelime Sayısı:', totalWords);
        
        // Başarılı toast mesajı
        this.toastService.show(`'${title}' yüklendi (${totalWords.toLocaleString()} kelime).`, 'success');
      } catch (err) {
        console.error("Kelime sayımı sırasında hata:", err);
        this.toastService.show('Kitap yüklendi ancak kelime sayımında hata oluştu.', 'error');
        totalWords = 0; // Hata durumunda 0 olarak kaydet
      }
      // YENİ GÖREV 9.3 SONU
      
      // Kapak resmini al
      const coverUrl = await book.coverUrl();
      let base64CoverString: string | undefined;
      
      if (coverUrl) {
        const response = await fetch(coverUrl);
        const coverBlob = await response.blob();
        base64CoverString = await this.blobToBase64(coverBlob);
      }
      
      // Yeni kitap nesnesi oluştur
      const newBook: IBook = {
        title: title,
        author: metadata.creator || 'Bilinmeyen Yazar',
        totalWords: totalWords,
        file: file,
        coverImage: base64CoverString
      };
      
      // Veritabanına kaydet
      await this.storageService.addBook(newBook);
      
      // Listeyi güncelle
      await this.loadBooks();
      
      // Epub.js'i hafızadan temizle
      book.destroy();
      
      console.log('Kitap başarıyla eklendi:', newBook.title);
    } catch (error) {
      console.error('EPUB yükleme hatası:', error);
      this.toastService.show('Kitap yüklenirken bir hata oluştu. Dosya bozuk veya desteklenmiyor olabilir.', 'error');
    } finally {
      // File input'u her durumda sıfırla
      (event.target as HTMLInputElement).value = '';
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  readPastedText(text: string): void {
    // Boş metni kontrol et
    if (!text || text.trim().length === 0) {
      alert('Lütfen okumak için bir metin girin');
      return;
    }

    // Modal'ı kapat
    this.showPasteModal = false;

    // Metni state ile Player sayfasına gönder
    this.router.navigate(['/player/text/'], { 
      state: { textToRead: text } 
    });
  }

  private stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
}
