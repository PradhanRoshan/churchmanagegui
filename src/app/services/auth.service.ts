import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { API_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL = API_URL;

  textResponse = {
    responseType: 'text' as 'json'
  }
  // Tracking to hide the navbar
  private loggedIn = new BehaviorSubject<boolean> (false);

  constructor(private router: Router, private http: HttpClient) { }

get isLoggedIn(): Observable<boolean>{
  return this.loggedIn.asObservable();
}

updateLoggedInValue(value:boolean): void{
  this.loggedIn.next(value);
}

  // Store authenticated user and token in sessionStorage
  authenticateUser(username: string, token: string) {
    sessionStorage.setItem('authenticaterUser', username);
    sessionStorage.setItem('jwtToken', token);
  }

  login(payload: any): Observable<AuthenticationBean> {

    return this.http.post<AuthenticationBean>(this.API_URL + "/auth/login", payload).pipe(
      map(
        data => {
          this.loggedIn.next(true);
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
    this.loggedIn.next(false);
    sessionStorage.removeItem('authenticaterUser');
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('userRole');
    this.router.navigate(['/home']);  // Redirect to the login page
  }

}
export class AuthenticationBean {
  //  jwtToken:string;
  userRole: string;
  constructor(public token: string) {

  }
}
