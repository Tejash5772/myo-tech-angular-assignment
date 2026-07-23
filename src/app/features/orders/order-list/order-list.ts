import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Order } from '../order';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency-pipe';
import { DataGrid } from '../../../shared/components/data-grid/data-grid';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, DataGrid, CustomCurrencyPipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList implements OnInit {
  private orderService = inject(Order);

  orders: Order[] = [];
  totalRecords = 0;

  // Different column definitions for the same Universal Grid
  columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'actions', label: 'Actions' }
  ];

  cellTemplates: Record<string, TemplateRef<any>> = {};

  @ViewChild('totalTemplate', { static: true }) totalTemplate!: TemplateRef<any>;

  ngOnInit() {
    // Map custom templates for the grid
    this.cellTemplates = {
      'totalAmount': this.totalTemplate,
    };

    // 1. Fetch the true total count for pagination math
    this.orderService.getAll().subscribe(allOrders => {
      this.totalRecords = allOrders.length;
    });

    // 2. EXPLICITLY fetch the first page of data on load
    this.orderService.getAll({ _page: 1, _limit: 10 }).subscribe(initialData => {
      this.orders = initialData;
    });
  }

  onGridStateChange(state: { page: number; limit: number; sort: string }) {
    const params = {
      _page: state.page,
      _limit: state.limit,
      _sort: state.sort ? state.sort.split('_')[0] : '',
      _order: state.sort ? state.sort.split('_')[1] : ''
    };

    this.orderService.getAll(params).subscribe(data => {
      this.orders = data;
    });
  }
}
