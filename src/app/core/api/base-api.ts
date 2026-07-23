import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export abstract class BaseApi<T> {
    protected http = inject(HttpClient);

    protected abstract getResourceUrl(): string;

    getAll(params?: any): Observable<T[]> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key]) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.http.get<T[]>(this.getResourceUrl(), { params: httpParams });
    }

    getById(id: string | number): Observable<T> {
        return this.http.get<T>(`${this.getResourceUrl()}/${id}`);
    }

    create(item: Partial<T>): Observable<T> {
        return this.http.post<T>(this.getResourceUrl(), item);
    }

    update(id: string | number, item: Partial<T>): Observable<T> {
        return this.http.put<T>(`${this.getResourceUrl()}/${id}`, item);
    }

    delete(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.getResourceUrl()}/${id}`);
    }
}