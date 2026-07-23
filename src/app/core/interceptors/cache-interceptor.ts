import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  data: any;
  expiryTime: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 5 * 60 * 1000; // 5 minutes Time-To-Live[cite: 1]

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Target specifically the GET /api/categories endpoint[cite: 1]
  if (req.method !== 'GET' || !req.url.includes('/api/categories')) {
    return next(req);
  }

  const cachedResponse = cache.get(req.urlWithParams);
  
  // Include TTL cache invalidation logic[cite: 1]
  if (cachedResponse && new Date().getTime() < cachedResponse.expiryTime) {
    // Return in-memory cached response[cite: 1]
    return of(new HttpResponse({ body: cachedResponse.data, status: 200 }));
  }

  // If cache is missing or expired, fetch from network and set cache
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.urlWithParams, {
          data: event.body,
          expiryTime: new Date().getTime() + TTL
        });
      }
    })
  );
};