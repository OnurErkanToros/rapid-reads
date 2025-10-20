import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import ePub from 'epubjs';
import { StorageService } from '../../core/services/storage.service';
import { IBook } from '../../core/models/book.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reader',
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './reader.html',
  styleUrl: './reader.scss'
})
export class Reader implements OnInit {
  book: IBook | undefined;
  chapters: any[] = [];
  iconArrowLeft = faArrowLeft;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
    // URL'den kitap ID'sini al
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!id) return;
    
    // Kitabı veritabanından çek
    this.book = await this.storageService.getBookById(id);
    
    if (!this.book) return;
    
    // EPUB dosyasını ArrayBuffer'a çevir ve yükle
    const arrayBuffer = await this.book.file.arrayBuffer();
    const epubBook = ePub(arrayBuffer);
    
    // Navigasyon bilgisini (içindekiler) al
    const nav = await epubBook.loaded.navigation;
    
    // Bölüm listesini ata
    this.chapters = nav.toc;
    
    // Epub.js'i hafızadan temizle
    epubBook.destroy();
  }

  public goBack(): void {
    this.location.back();
  }

  encodeChapterHref(href: string): string {
    return btoa(encodeURIComponent(href));
  }
}
