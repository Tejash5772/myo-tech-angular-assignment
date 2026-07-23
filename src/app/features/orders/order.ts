import { Service } from '@angular/core';
import { BaseApi } from '../../core/api/base-api';

export interface OrderItem {
  productId: string | number;
  quantity: number;
  price: number;
  taxes: any[];
  discounts: any[];
}

export interface Order {
  id?: string | number;
  customerName: string;
  items: OrderItem[];
  totalAmount?: number;
}

@Service()
export class Order extends BaseApi<Order> {
  protected getResourceUrl(): string {
    return '/api/orders'; 
  }
}