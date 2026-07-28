import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Observable, timer, switchMap, of, catchError } from 'rxjs';
import { Order } from '../order';
import { Toast } from '../../../core/services/toast';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-entry',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './order-entry.html',
  styleUrl: './order-entry.scss',
  standalone: true
})
export class OrderEntry {
  private fb = inject(FormBuilder);
  private toastService = inject(Toast);
  private orderService = inject(Order);
  private router = inject(Router);
  
  orderForm: FormGroup;
  orderTotal = 0;

  constructor() {
    this.orderForm = this.fb.group({
      customerName: [''],
      items: this.fb.array([])
    });

    // Dynamic Calculation Stream[cite: 1]
    this.orderForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      productId: ['', null, [this.stockValidator.bind(this)]],
      quantity: [1],
      price: [0],
      taxes: this.fb.array([]),
      discounts: this.fb.array([])
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  // Async Validator checking item stock availability on line item blur[cite: 1]
  stockValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(500).pipe(
      switchMap(() => {
        const productId = control.value;
        const hasStock = productId !== 'OUT_OF_STOCK'; 
        return of(hasStock ? null : { outOfStock: true });
      }),
      catchError(() => of(null))
    );
  }

  calculateTotals() {
    let total = 0;
    this.items.controls.forEach(item => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      total += (qty * price);
    });
    this.orderTotal = total;
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const orderPayload = {
        ...this.orderForm.value,
        totalAmount: this.orderTotal
      };
      this.orderService.create(orderPayload).subscribe(res => {
        this.toastService.showSuccess('Order successfully created!');
        this.orderForm.reset();
        this.items.clear();
        this.router.navigate(['/orders']);
      });
    }
  }
}