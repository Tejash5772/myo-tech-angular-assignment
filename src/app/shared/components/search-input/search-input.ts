import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput implements OnInit {
  searchControl = new FormControl('');
  results: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after keystrokes
      distinctUntilChanged(), // Only emit if value changed
      switchMap(query => {
        // switchMap automatically unsubscribes from the previous observable,
        // which causes Angular's HttpClient to abort the stale HTTP request[cite: 1]
        if (!query) return of([]);
        return this.http.get<any[]>(`/api/products?q=${query}`).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(data => {
      this.results = data;
    });
  }
}
