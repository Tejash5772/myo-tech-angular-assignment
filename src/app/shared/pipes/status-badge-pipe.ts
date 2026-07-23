import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'badge badge-success';
      case 'pending':
        return 'badge badge-warning';
      case 'cancelled':
      case 'inactive':
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
  }
}