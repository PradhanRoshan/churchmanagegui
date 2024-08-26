import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL = "http://localhost:8080/api";

  textResponse = {
    responseType: 'text' as 'json'
  }

  constructor(private router: Router, private http: HttpClient) { }

  // Store authenticated user and token in sessionStorage
  authenticateUser(username: string, token: string) {
    sessionStorage.setItem('authenticaterUser', username);
    sessionStorage.setItem('jwtToken', token);
  }

  login(payload: any): Observable<AuthenticationBean> {

    return this.http.post<AuthenticationBean>(this.API_URL + "/auth/login", payload).pipe(
      map(
        data => {
          sessionStorage.setItem('jwtToken', data.token);
          sessionStorage.setItem('userRole', data.userRole);
          return data;
        }
      )
    );
  }

  signUp(payload: any): Observable<any> {
    return this.http.post<any>(this.API_URL + "/auth/signup", payload, this.textResponse);
  }

  // Get the authenticated user's name from sessionStorage
  getAuthenticatedUser() {
    return sessionStorage.getItem('authenticaterUser')
  }

  // Get the JWT token from sessionStorage if the user is authenticated
  getAuthenticatedToken() {
    return this.getAuthenticatedUser() ? sessionStorage.getItem('jwtToken') : null;
  }
  // Get the JWT token from sessionStorage if the user is authenticated
  getAuthenticatedUserRole() {
    let userRole: any;
    if(this.getAuthenticatedUser()){
      switch (sessionStorage.getItem('userRole')) {
        case "1":
          userRole="Admin";
          break;
        case "2":
          userRole="Member";
          break;
        case "3":
          userRole="Volunteer";
          break;
      
        default:
          userRole="Unknown Role";
          break;
      }

    }
    return userRole;
    // return this.getAuthenticatedUser() ? sessionStorage.getItem('userRole') : null;
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
    sessionStorage.removeItem('userRole');
    this.router.navigate(['/login']);  // Redirect to the login page
  }

}
export class AuthenticationBean {
  //  jwtToken:string;
  userRole: string;
  constructor(public token: string) {

  }
}
