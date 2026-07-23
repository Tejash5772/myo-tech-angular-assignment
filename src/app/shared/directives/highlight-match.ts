import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightMatch]',
  standalone: true
})
export class HighlightMatch implements OnChanges {
  @Input() appHighlightMatch: string = '';
  @Input() textToHighlight: string = '';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.textToHighlight) {
      this.el.nativeElement.innerHTML = '';
      return;
    }
    
    if (!this.appHighlightMatch) {
      this.el.nativeElement.innerHTML = this.textToHighlight;
      return;
    }

    const regex = new RegExp(`(${this.appHighlightMatch})`, 'gi');
    this.el.nativeElement.innerHTML = this.textToHighlight.replace(
      regex, 
      `<mark style="background-color: yellow;">$1</mark>`
    );
  }
}
