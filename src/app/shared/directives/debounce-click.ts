import { Directive, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Directive({
  selector: '[appDebounceClick]',
  standalone: true
})
export class DebounceClick implements OnInit, OnDestroy {
  @Output() debounceClick = new EventEmitter<Event>();
  private clicks = new Subject<Event>();
  private subscription!: Subscription;

  ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(500)
    ).subscribe(e => this.debounceClick.emit(e));
  }

  @HostListener('click', ['$event'])
  clickEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
