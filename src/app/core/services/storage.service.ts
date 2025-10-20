import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { IBook } from '../models/book.model';

export interface IReadingSession {
  id?: number;
  bookId: number;
  startTime: number; // Date.now()
  endTime: number;   // Date.now()
  wordsRead: number;
}

class AppDB extends Dexie {
  books!: Table<IBook>;
  readingSessions!: Table<IReadingSession>;

  constructor() {
    super('rapid-reads-db');
    this.version(1).stores({
      books: '++id, &title'
    });
    this.version(2).stores({
      books: '++id, &title, author'
    });
    this.version(3).stores({
      books: '++id, &title, author, totalWords', // 'totalWords' eklendi
      readingSessions: '++id, bookId, startTime' // Yeni tablo eklendi
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: AppDB;

  constructor() {
    this.db = new AppDB();
  }

  addBook(book: IBook): Promise<number> {
    return this.db.books.add(book);
  }

  getAllBooks(): Promise<IBook[]> {
    return this.db.books.toArray();
  }

  getBookById(id: number): Promise<IBook | undefined> {
    return this.db.books.get(id);
  }

  public async getBookByTitle(title: string): Promise<IBook | undefined> {
    return await this.db.books.where('title').equals(title).first();
  }

  updateBookProgress(id: number, progress: any): Promise<number> {
    return this.db.books.update(id, { progress: progress });
  }

  async deleteBook(id: number): Promise<void> {
    await this.db.books.delete(id);
  }

  public async addReadingSession(session: IReadingSession): Promise<number> {
    return await this.db.readingSessions.add(session);
  }

  public async getAllReadingSessions(): Promise<IReadingSession[]> {
    // 'readingSessions' tablosundaki tüm kayıtları bir dizi olarak çek
    return await this.db.readingSessions.toArray();
  }
}

