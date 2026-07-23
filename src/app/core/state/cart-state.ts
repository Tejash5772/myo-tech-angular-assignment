import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Service, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Service()
export class CartState {
    private http = inject(HttpClient);

    // Angular Signals for UI state[cite: 1]
    cartItems = signal<any[]>([]);

    // Computed signal[cite: 1]
    cartTotal = computed(() =>
        this.cartItems().reduce((acc, item) => acc + item.price, 0)
    );

    // Bridging Signal to RxJS stream[cite: 1]
    cartItems$ = toObservable(this.cartItems);

    constructor() {
        // Effect to log changes or trigger side-effects[cite: 1]
        effect(() => {
            console.log('Cart updated. New Total:', this.cartTotal());
        });

        // Seamless coexistence: Reacting to signal changes with RxJS[cite: 1]
        this.cartItems$.pipe(
            switchMap(items => this.http.post('/api/cart/sync', items))
        ).subscribe();
    }

    addToCart(item: any) {
        this.cartItems.update(items => [...items, item]);
    }
}
