import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastEvent {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toastEvents = new Subject<ToastEvent>();

  constructor() {}

  public show(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastEvents.next({ message, type });
  }
}
