import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, position: 'prefix' | 'suffix' = 'prefix'): string {
    if (value == null) return '';
    const formatted = value.toLocaleString('en-IN');
    return position === 'prefix' ? `₹ ${formatted}` : `${formatted} ₹`;
  }
}
