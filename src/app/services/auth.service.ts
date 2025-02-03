import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, catchError } from 'rxjs';
import { API_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL = API_URL;

  textResponse = {
    responseType: 'text' as 'json'
  }

  // Track logged-in state
  private loggedIn = new BehaviorSubject<boolean>(this.isUserLoggedIn());

  constructor(private router: Router, private http: HttpClient) { }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  updateLoggedInValue(value: boolean): void {
    this.loggedIn.next(value);
  }

  // Store authenticated user and token in sessionStorage
  authenticateUser(username: string, token: string) {
    sessionStorage.setItem('authenticaterUser', username);
    sessionStorage.setItem('jwtToken', token);
  }

  login(payload: any): Observable<AuthenticationBean> {
    return this.http.post<AuthenticationBean>(this.API_URL + "/auth/login", payload).pipe(
      map(data => {
        this.loggedIn.next(true);
        const loginTime = new Date().getTime();
        this.authenticateUser(data.userDetialsDto.username, data.token);
        sessionStorage.setItem('loginTime', loginTime.toString());
        sessionStorage.setItem('userDetials', JSON.stringify(data.userDetialsDto));
        console.log('JWT Token stored:', data.token);
        return data;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  signUp(payload: any): Observable<any> {
    return this.http.post<any>(this.API_URL + "/auth/signup", payload, this.textResponse);
  }

  resetUserPassword(payload: any) {
    return this.http.post<any>(this.API_URL + "/auth/reset-password", payload, this.textResponse);
  }

  // Get the authenticated user's name from sessionStorage
  getAuthenticatedUser(): string | null {
    return sessionStorage.getItem('authenticaterUser');
  }

  // Get the JWT token from sessionStorage if the user is authenticated
  getAuthenticatedToken(): string | null {
    const user = this.getAuthenticatedUser();
    if (!user) {
      console.log('No authenticated user found');
      return null;
    }

    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      console.log('No JWT token found for the authenticated user');
      return null;
    }

    console.log('Retrieved JWT Token:', token);
    return token;
  }

  // Check if a user is logged in by verifying the presence of the authenticated user in sessionStorage
  isUserLoggedIn(): boolean {
    const user = sessionStorage.getItem('authenticaterUser');
    return !!user;  // Returns true if user is logged in, false otherwise
  }

  // Logout the user by removing the authenticated user and token from sessionStorage
  logout() {
    this.loggedIn.next(false);
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('authenticaterUser');
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('userDetials');
    this.router.navigate(['/home']);  // Redirect to the home page
  }
}

export class AuthenticationBean {
  userRole?: string;
  userDetialsDto?: any;
  constructor(public token: string) { }
}
