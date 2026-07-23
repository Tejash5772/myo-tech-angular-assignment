import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.scss',
  standalone: true,
})
export class DynamicForm implements OnInit, OnDestroy {
  @Input() schema: any[] = [];
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.handleDependencies();
  }

  buildForm() {
    const group: any = {};
    this.schema.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      if (field.min) validators.push(Validators.min(field.min));
      group[field.key] = [field.value || '', validators];
    });
    this.form = this.fb.group(group);
  }

  handleDependencies() {
    this.schema.forEach(field => {
      if (field.dependson) {
        const parentControl = this.form.get(field.dependson);
        const childControl = this.form.get(field.key);
        
        parentControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
          if (value) {
            childControl?.enable();
            // Logic to fetch new dropdown options for child from API can go here
          } else {
            childControl?.disable();
            childControl?.reset();
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Payload:', this.form.value);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}