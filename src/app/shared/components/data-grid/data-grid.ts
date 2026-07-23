import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-data-grid',
  imports: [CommonModule],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  standalone: true,
})
export class DataGrid implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string }[] = [];
  @Input() totalRecords = 0;
  
  @Output() stateChange = new EventEmitter<{ page: number, limit: number, sort: string }>();

  @Input() cellTemplates: Record<string, TemplateRef<any>> = {};

  page = 1;
  limit = 1;
  sort = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : 1;
      this.limit = params['limit'] ? +params['limit'] : 1;
      this.sort = params['sort_order'] || '';
      
      this.stateChange.emit({ page: this.page, limit: this.limit, sort: this.sort });
    });
  }

  // Calculate total pages based on total records and page limit
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.limit) || 1;
  }

  onSort(columnKey: string) {
    this.sort = this.sort === `${columnKey}_asc` ? `${columnKey}_desc` : `${columnKey}_asc`;
    this.updateUrl();
  }

  onPageChange(newPage: number) {
    // Boundary check to prevent navigating past available data
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.updateUrl();
    }
  }

  private updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page, limit: this.limit, sort_order: this.sort },
      queryParamsHandling: 'merge'
    });
  }
}