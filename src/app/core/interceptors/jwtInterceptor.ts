import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

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
            console.error('🔍 Raw error response:', JSON.stringify(error.error));
            // console.error('🔍 JSON.parse response:', JSON.parse(error.error));
            const errorString = JSON.stringify(error.error);
            const parsedError = JSON.parse(errorString);


            console.log('[401, 403, 500].includes(parsedError.status):', [401, 403, 500].includes(Number(parsedError.status)));
            console.log('includes(parsedError.status):', ['Invalid JWT signature','Invalid JWT','JWT Expired'].includes(parsedError.error));


            if ([401, 403].includes(Number(parsedError.status)) && ['Invalid JWT signature','Invalid JWT','JWT Expired'].includes(parsedError.error)) {
                console.log('🔄'+ parsedError.error +'- Logging out...');
                alert('Token expired - Logging out...');
                authService.logout();
                router.navigate(['/login']);
            }

            return throwError(() => error);
        })
    );
};
