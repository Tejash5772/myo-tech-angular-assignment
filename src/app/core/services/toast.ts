import { Service, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Service()
export class Toast {
  // Signal holding the active toasts state
  toasts = signal<ToastMessage[]>([]);
  private toastIdCounter = 0;

  constructor() {}

  /**
   * Method called by the global error interceptor to display error messages.
   */
  showError(message: string): void {
    this.addToast(message, 'error');
  }

  /**
   * Optional helper for success messages (e.g., successful form submissions)
   */
  showSuccess(message: string): void {
    this.addToast(message, 'success');
  }

  private addToast(message: string, type: 'success' | 'error' | 'info'): void {
    const id = ++this.toastIdCounter;
    
    // Add new toast to the signal array
    this.toasts.update(currentToasts => [...currentToasts, { id, message, type }]);

    // Auto-remove the toast after 5 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 5000);
  }

  /**
   * Manually remove a toast (can be bound to a close button in the UI)
   */
  removeToast(id: number): void {
    this.toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }
}
