import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

  constructor(private router: Router,private http: HttpClient) { }

  // Store authenticated user and token in sessionStorage
  authenticateUser(username: string, token: string) {
    sessionStorage.setItem('authenticaterUser', username);
    sessionStorage.setItem('jwtToken', token);
  }

  executeAutheticationServicea(payload:any): Observable<AuthenticationBean> {
   
    return this.http.post<AuthenticationBean>(`http://localhost:8080/api/auth/login`, payload).pipe(
            map(
              data => {
                sessionStorage.setItem('jwtToken', data.token);
                return data;
              }
            )
          );
  }

  // Get the authenticated user's name from sessionStorage
  getAuthenticatedUser() {
    return sessionStorage.getItem('authenticaterUser')
  }

  // Get the JWT token from sessionStorage if the user is authenticated
  getAuthenticatedToken() {
    return this.getAuthenticatedUser() ? sessionStorage.getItem('jwtToken') : null;
  }

  // Check if a user is logged in by verifying the presence of the authenticated user in sessionStorage
  isUserLoggedIn() {
    const user = sessionStorage.getItem('authenticaterUser');
    return !(user === null);  // Returns true if user is logged in, false otherwise
  }

// Logout the user by removing the authenticated user and token from sessionStorage
  logout() {
    sessionStorage.removeItem('authenticaterUser');
    sessionStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);  // Redirect to the login page
  }

}
export class AuthenticationBean {
  //  jwtToken:string;
  constructor(public token: string) {

  }
}
