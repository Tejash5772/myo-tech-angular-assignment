import { CommonModule } from '@angular/common';
import { Component, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUpload),
      multi: true
    }
  ]
})
export class FileUpload implements ControlValueAccessor {
  previewUrl: string | null = null;
  onChange = (value: string) => {};
  onTouched = () => {};

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) this.handleFile(file);
  }

  handleFile(file: File) {
    // File dimension/size validation (e.g., max 2MB)[cite: 1]
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Base64 encoding and live preview rendering[cite: 1]
      const base64String = reader.result as string;
      this.previewUrl = base64String;
      this.onChange(base64String);
      this.onTouched();
    };
    reader.readAsDataURL(file);
  }

  writeValue(value: any): void {
    this.previewUrl = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}