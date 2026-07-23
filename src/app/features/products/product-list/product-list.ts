import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge-pipe';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency-pipe';
import { DataGrid } from '../../../shared/components/data-grid/data-grid';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product';
import { OptimisticDelete } from '../../../core/services/optimistic-delete';

@Component({
  selector: 'app-product-list',
  imports: [DataGrid, CustomCurrencyPipe, StatusBadgePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  standalone: true
})
export class ProductList implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(Product);
  private router = inject(Router);
  private optimisticDeleteService = inject(OptimisticDelete);

  products: Product[] = [];
  totalRecords = 0;

  // Dynamic column definitions for the Universal Data Grid[cite: 1]
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'productName', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  // Object to map column keys to custom ng-templates[cite: 1]
  cellTemplates: Record<string, TemplateRef<any>> = {};

  @ViewChild('priceTemplate', { static: true }) priceTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  ngOnInit() {
    // Map the templates for the grid to use dynamically[cite: 1]
    this.cellTemplates = {
      'price': this.priceTemplate,
      'status': this.statusTemplate,
      'actions': this.actionsTemplate
    };

    // Consume the prefetched grid datasets from the Route Data Resolver[cite: 1]
    this.route.data.subscribe(({ gridData }) => {
      if (gridData) {
        this.products = gridData;
        // In a real scenario, the API response might contain the total count in headers
        this.totalRecords = gridData.length;
      }
    });
  }

  /**
   * Handles pagination and sorting state emitted by the DataGridComponent.
   * Fetches new data from the API based on the updated state.
   */
  onGridStateChange(state: { page: number; limit: number; sort: string }) {
    const params = {
      _page: state.page,
      _limit: state.limit,
      _sort: state.sort ? state.sort.split('_')[0] : '',
      _order: state.sort ? state.sort.split('_')[1] : ''
    };

    this.productService.getAll(params).subscribe(data => {
      this.products = data;
    });
  }

  // Navigate to an edit route, passing the product ID
  editProduct(product: Product) {
    // Assuming you have an edit route set up like '/dynamic-form/:id' or '/products/edit/:id'
    this.router.navigate(['/products/edit', product.id]); 
  }

  // Execute the Optimistic UI Delete
  deleteProduct(product: Product) {
    // 1. Define how the component's UI should update immediately
    const updateListCallback = (newList: Product[]) => {
      this.products = newList;
      this.totalRecords = newList.length;
    };

    // 2. Call the service, passing the API endpoint, the item, the current list, and the callback
    this.optimisticDeleteService.executeSoftDelete(
      '/api/products', 
      product, 
      this.products, 
      updateListCallback
    );
  }
}