import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IBook } from '../../../core/models/book.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  template: `
    <div 
      [routerLink]="['/reader', book.id]" 
      class="card hover:bg-gray-50 dark:hover:bg-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer relative flex flex-col h-full"
    >
      <button
        (click)="onDelete($event)"
        class="absolute top-2 right-2 btn-ghost btn-ghost-danger p-1 rounded-full"
        title="Kitabı Sil"
      >
        <fa-icon [icon]="iconTrash"></fa-icon>
      </button>
      
      <div class="aspect-[2/3] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <img 
          *ngIf="book.coverImage" 
          [src]="book.coverImage" 
          [alt]="book.title"
          class="w-full h-full object-cover"
        />
        <div *ngIf="!book.coverImage" class="text-white text-center">
          <span class="text-6xl font-bold">{{ book.title.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
      
      <div class="p-4 flex flex-col flex-1">
        <h3 class="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2" [title]="book.title">
          {{ book.title }}
        </h3>
        
        <p *ngIf="book.author" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ book.author }}
        </p>
        
        <!-- Progress Bar with Percentage -->
        <div class="mt-auto pt-3" *ngIf="book.totalWords && book.totalWords > 0">
          <div class="flex items-center">
            <div class="flex-grow bg-gray-200 rounded-full h-1 dark:bg-gray-700 relative">
              <div class="bg-blue-600 h-1 rounded-full"
                   [style.width.%]="progressPercentage">
              </div>
            </div>
            <span class="w-5 text-right text-xs text-gray-500 dark:text-gray-400">
              {{ progressPercentage | number:'1.0-0' }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookCardComponent {
  @Input() book!: IBook;
  @Output() bookDeleted = new EventEmitter<IBook>();
  iconTrash = faTrash;

  public get progressPercentage(): number {
    if (this.book && this.book.progress && this.book.totalWords && this.book.totalWords > 0) {
      // 'wordIndex' artık her zaman doğru kelime indeksini tutuyor
      // (FAZ 8 Düzeltmesi sayesinde)
      const wordIndex = this.book.progress.wordIndex || 0;

      // Yüzdeyi hesapla (ve 100'ü geçmediğinden emin ol)
      const percentage = Math.min(100, (wordIndex / this.book.totalWords) * 100);
      
      // Debug: İlerleme hesaplamasını logla
      if (percentage > 0) {
        console.log(`📊 Progress for "${this.book.title}": ${wordIndex}/${this.book.totalWords} = ${percentage.toFixed(1)}%`);
      }
      
      return percentage;
    }

    // Eğer veri yoksa, 0 dön
    return 0;
  }

  constructor(private router: Router) {}

  onDelete(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    this.bookDeleted.emit(this.book);
  }
}

