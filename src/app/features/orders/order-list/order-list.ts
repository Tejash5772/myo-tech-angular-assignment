import { Component, inject, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  orders: any[] = []; 
  totalRecords = 0;

  columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'totalAmount', label: 'Total Amount' }
  ];

  cellTemplates: Record<string, TemplateRef<any>> = {};

  @ViewChild('totalTemplate', { static: true }) totalTemplate!: TemplateRef<any>;

  ngOnInit() {
    this.cellTemplates = {
      'totalAmount': this.totalTemplate,
    };
  }

  onGridStateChange(state: { page: number; limit: number }) {
    const params = {
      _page: state.page,
      _limit: state.limit
    };

    // 1. Fetch Paginated Data
    this.orderService.getAll(params).subscribe((response: any) => {

      let rawOrders: any[] = [];
      if (Array.isArray(response)) {
        rawOrders = response;
      } else if (response && Array.isArray(response.data)) {
        rawOrders = response.data;
      } else if (response && Array.isArray(response.items)) {
        rawOrders = response.items;
      }

      // Map properties for the grid
      this.orders = rawOrders.map((order: any) => ({
        ...order,
        customerName: order.customerName || 'N/A',
        totalAmount: this.calculateTotal(order)
      }));
      
      // Force Angular to re-render the UI with the new data
      this.cdr.detectChanges(); 
    });

    // 2. Fetch Total Count for Pagination
    this.orderService.getAll().subscribe((allData: any) => {
      if (Array.isArray(allData)) {
        this.totalRecords = allData.length;
      } else if (allData && allData.items) {
        this.totalRecords = allData.items;
      } else if (allData && allData.data) {
         this.totalRecords = allData.data.length;
      }
      this.cdr.detectChanges();
    });
  }

  private calculateTotal(order: any): number {
    if (order.grandTotal) return order.grandTotal;
    if (!order.items) return 0;
    
    return order.items.reduce((sum: number, item: any) => {
      return sum + ((item.price || 0) * (item.quantity || 0));
    }, 0);
  }
}