import { Routes } from '@angular/router';
import { dataResolver } from './core/services/data-resolver';
import { dirtyCheckGuard } from './core/guards/dirty-check-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders/new',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadComponent: () => 
      import('./features/orders/order-list/order-list')
        .then(m => m.OrderList)
  },
  {
    path: 'orders/new',
    // Lazy loading the Order Entry feature we built in Step 4
    loadComponent: () =>
      import('./features/orders/order-entry/order-entry')
        .then(m => m.OrderEntry),
    // Applying the CanDeactivate guard from Step 7 blocking route transitions if form state is dirty
    canDeactivate: [dirtyCheckGuard]
  },
  {
    path: 'products',
    // Assuming you wrap the Universal Data Grid in a feature component
    loadComponent: () =>
      import('./features/products/product-list/product-list')
        .then(m => m.ProductList),
    // Prefetching grid datasets using Angular ResolveFn from Step 13
    resolve: {
      gridData: dataResolver
    }
  },
  {
    // The ':id' is a dynamic route parameter
    path: 'products/edit/:id',
    // Load whichever component is responsible for editing the product. 
    // You can use a dedicated EditComponent or reuse your DynamicFormComponent.
    loadComponent: () => 
      import('./features/products/product-edit/product-edit')
        .then(m => m.ProductEdit)
  },
  {
    path: 'dynamic-form',
    // Lazy loading the dynamic form engine component from Step 1
    loadComponent: () =>
      import('./shared/components/dynamic-form/dynamic-form')
        .then(m => m.DynamicForm),
    canDeactivate: [dirtyCheckGuard]
  },
  {
    // Fallback route for 404s
    path: '**',
    redirectTo: 'orders/new'
  }
];