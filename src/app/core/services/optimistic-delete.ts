import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';

@Service()
export class OptimisticDelete {

    private http = inject(HttpClient);

    // Simulating the Toast notification system state
    public toastState$ = new BehaviorSubject<{ show: boolean, message: string, id: any } | null>(null);

    private deleteTimerSub!: Subscription;
    private cachedData: any = null; // Store for state restoration

    executeSoftDelete(apiUrl: string, item: any, listData: any[], updateListCallback: (newList: any[]) => void) {
        // 1. Save state
        this.cachedData = { item, originalList: [...listData] };

        // 2. Optimistic Update (Immediate UI Removal)[cite: 1]
        const updatedList = listData.filter(i => i.id !== item.id);
        updateListCallback(updatedList);

        // 3. Show 5-second Toast with Undo[cite: 1]
        this.toastState$.next({ show: true, message: `Deleted ${item.name}`, id: item.id });

        // 4. Start 5-second timer
        this.deleteTimerSub = timer(5000).subscribe(() => {
            this.toastState$.next(null); // Hide toast
            // Timer expired, execute real DELETE API call[cite: 1]
            this.http.delete(`${apiUrl}/${item.id}`).subscribe({
                error: (err) => {
                    // If network fails, restore state
                    updateListCallback(this.cachedData.originalList);
                }
            });
        });
    }

    undoDelete(updateListCallback: (newList: any[]) => void) {
        if (this.deleteTimerSub) {
            this.deleteTimerSub.unsubscribe(); // Stop the delete request[cite: 1]
        }
        this.toastState$.next(null); // Hide toast

        // Restore state[cite: 1]
        if (this.cachedData) {
            updateListCallback(this.cachedData.originalList);
            this.cachedData = null;
        }
    }
}
