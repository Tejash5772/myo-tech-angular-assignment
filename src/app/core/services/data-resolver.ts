import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ProgressBar } from './progress-bar';
import { Product } from '../../features/products/product';

export const dataResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  const productService = inject(Product);
  const progressBar = inject(ProgressBar);

  // Show global top progress bar
  progressBar.show();

  // 1. Extract query params from the initial URL, or use defaults
  const page = route.queryParamMap.get('page') || 1;
  const limit = route.queryParamMap.get('limit') || 10;

  // 2. Format params for json-server
  const params: any = {
    _page: page,
    _limit: limit
  };

  // 3. Fetch pre-paginated data via the ProductService
  return productService.getAll(params).pipe(
    finalize(() => {
      // Hide progress bar once resolution is complete
      progressBar.hide();
    })
  );
};