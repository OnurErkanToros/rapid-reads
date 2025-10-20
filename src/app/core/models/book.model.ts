export interface IBookProgress {
  chapterHref: string;
  wordIndex: number;
}

export interface IBook {
  id?: number;
  title: string;
  author?: string;
  totalWords?: number;
  file: Blob;
  coverImage?: string;
  progress?: IBookProgress;
}

