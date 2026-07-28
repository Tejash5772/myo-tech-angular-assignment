import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-toast-ui',
  imports: [CommonModule],
  templateUrl: './toast-ui.html',
  styleUrl: './toast-ui.scss',
})
export class ToastUi {
  toastService = inject(Toast);
}
