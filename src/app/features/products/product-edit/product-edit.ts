import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../product';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-product-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss',
  standalone: true
})
export class ProductEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(Product);
  private fb = inject(FormBuilder);
  private toastService = inject(Toast);

  editForm!: FormGroup;
  productId: string | null = null;
  isLoading = true;

  ngOnInit() {
    // 1. Initialize the form structure
    this.editForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      status: ['Active', Validators.required]
    });

    // 2. Extract the ID from the URL
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      // 3. Fetch the product data and populate the form
      this.productService.getById(this.productId).subscribe({
        next: (product: Product) => {
          this.editForm.patchValue({
            productName: product.productName,
            category: product.category,
            subCategory: product.subCategory,
            price: product.price,
            status: product.status
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.showError('Failed to load product details.');
          this.router.navigate(['/products']);
        }
      });
    }
  }

  onSubmit() {
    if (this.editForm.valid && this.productId) {
      // 4. Update the product via the BaseApiService abstraction[cite: 1]
      this.productService.update(this.productId, this.editForm.value).subscribe({
        next: () => {
          this.toastService.showSuccess('Product updated successfully!');
          // Navigate back to the data grid
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
