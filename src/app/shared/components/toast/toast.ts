import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastEvent } from '../../../core/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class ToastComponent implements OnInit {
  public toasts: ToastEvent[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastEvents.subscribe((toast: ToastEvent) => {
      this.toasts.push(toast);
      
      setTimeout(() => {
        this.removeToast(toast);
      }, 3000);
    });
  }

  public removeToast(toastToRemove: ToastEvent): void {
    this.toasts = this.toasts.filter(toast => toast !== toastToRemove);
  }
}
