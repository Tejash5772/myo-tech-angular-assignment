import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { retry, catchError, throwError } from 'rxjs';
import { Toast } from '../services/toast'; // Assume a basic toast service exists
import { ProgressBar } from '../services/progress-bar'; // Created in Step 13

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(Toast);
  const progressBarService = inject(ProgressBar);

  return next(req).pipe(
    retry(2), // Automatically retry failed requests twice
    catchError((error: HttpErrorResponse) => {
      progressBarService.hide(); // Hide loading spinners on error

      let errorMessage = 'An unknown error occurred!';
      
      // Catching specific HTTP status codes[cite: 1]
      if (error.status === 401) {
        errorMessage = 'Unauthorized access. Please log in.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 500) {
        errorMessage = 'Internal Server Error. Please try again later.';
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      }

      toastService.showError(errorMessage); // Trigger global toast notification[cite: 1]
      
      return throwError(() => new Error(errorMessage));
    })
  );
};