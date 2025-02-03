import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log('Interceptor called for request:', req.url);

    const token = authService.getAuthenticatedToken();

    if (token) {
        console.log('Token found:', token);
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        console.log('No token found');
        return next(req);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Interceptor error:', error);

            if ([401, 403].includes(error.status) && error.error?.message === 'Token expired') {
                console.log('🔄 Token expired - Logging out...');
                authService.logout();
                router.navigate(['/login']);
            }

            return throwError(() => error);
        })
    );
};
