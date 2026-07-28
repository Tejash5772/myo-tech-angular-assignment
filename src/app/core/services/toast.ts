import { Injectable, signal } from '@angular/core'; // Changed import

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' }) // Correct Angular decorator
export class Toast {
  // Signal holding the active toasts state
  toasts = signal<ToastMessage[]>([]);
  private toastIdCounter = 0;

  constructor() {}

  showError(message: string): void {
    this.addToast(message, 'error');
  }

  showSuccess(message: string): void {
    this.addToast(message, 'success');
  }

  private addToast(message: string, type: 'success' | 'error' | 'info'): void {
    const id = ++this.toastIdCounter;
    this.toasts.update(currentToasts => [...currentToasts, { id, message, type }]);

    setTimeout(() => {
      this.removeToast(id);
    }, 5000);
  }

  removeToast(id: number): void {
    this.toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }
}