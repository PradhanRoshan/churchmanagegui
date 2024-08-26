import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpIntercepterJwtAuthService implements HttpInterceptor{

  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = this.authService.getAuthenticatedToken(); // sessionStorage.getItem('jwtToken');
    if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
  // Handle response errors
  return next.handle(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403].includes(error.status) && error.error?.message === 'Token expired') {
        // If token is expired, logout and redirect to login page
        this.authService.logout();
      }

      // Use a factory function in throwError to remove the deprecation warning
      return throwError(() => error);  // Updated throwError usage
    })
  );
}

}
