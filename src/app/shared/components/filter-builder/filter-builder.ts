import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-builder',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter-builder.html',
  styleUrl: './filter-builder.scss',
  standalone: true,
})
export class FilterBuilder {
  @Input() availableFields: string[] = ['Category', 'Price', 'Stock', 'Status'];
  @Output() filterChange = new EventEmitter<any>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      condition: ['AND'],
      rules: this.fb.array([this.createRule()])
    });

    this.filterForm.valueChanges.subscribe(val => {
      this.filterChange.emit(val);
    });
  }

  get rules() {
    return this.filterForm.get('rules') as FormArray;
  }

  createRule(): FormGroup {
    return this.fb.group({
      field: [''],
      operator: ['='],
      value: ['']
    });
  }

  addRule() {
    this.rules.push(this.createRule());
  }

  removeRule(index: number) {
    this.rules.removeAt(index);
  }
}
