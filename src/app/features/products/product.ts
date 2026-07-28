import { Service } from '@angular/core';
import { BaseApi } from '../../core/api/base-api';

export interface Product {
  id: number | string;
  productName: string;
  category: string;
  subCategory?: string;
  price: number;
  stock?: number;
  status?: string;
}

@Service()
export class Product extends BaseApi<Product> {
  protected endpoint = '/products';
}
