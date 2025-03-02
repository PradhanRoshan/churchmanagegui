import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, catchError } from 'rxjs';
import { API_URL } from '../../../environments/environment';
import { UserDetails } from '../model/user-details.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL = API_URL;

  textResponse = {
    responseType: 'text' as 'json'
  }

// Store loggined User Details in BehaviorSubject
  private userDetails = new BehaviorSubject<UserDetails>(null);

  // Get user role as an observable
  currentUser$ = this.userDetails.asObservable();

  getUserDetails(): Observable<UserDetails> {
    return this.userDetails.asObservable();
  }

  setUserDetials(userDetails: UserDetails) {
    this.userDetails.next(userDetails);
  }


  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Store loggined User Role in BehaviorSubject
  // This BehaviorSubject can be used to track the user's role throughout the application
  private userRole = new BehaviorSubject<string | null>(null);

  // Get user role as an observable
  // This observable can be used to subscribe to role changes
  // and react to role changes in the application
  // For example, you can use it to conditionally render UI elements based on the user's role
   userRole$ = this.userRole.asObservable();

  getUserRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  // Update user role
  setUserRole(role: string | null): void {
    this.userRole.next(role);
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

        this.setUserDetailsToSubject(data.userDetialsDto);
        this.authenticateUser(data.userDetialsDto.username, data.token);
        const loginTime = new Date().getTime();
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
  setUserDetailsToSubject(data: any) {
      let userDetailData : UserDetails ={
        member: data.member,
        role: data.role,
        address: data.address,
        user: data.user
      }
        this.setUserRole(data.role.roleName);
        this.setUserDetials(userDetailData);
  }


  
// Get userInfo Details by passing MemberID - use this to update any user detials
  getUserDetailsInfo(memberId: string) :Observable<UserDetails>{
       return this.http.get<UserDetails>(this.API_URL + "/user/user-info/" +memberId).pipe(
        map((data: UserDetails) => {
          console.log('Data fetched from API:', data);
          this.setUserDetailsToSubject(data);
          sessionStorage.setItem('userDetials', JSON.stringify(data));
          return data;
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
    sessionStorage.removeItem('newApplicationCount')
    this.router.navigate(['/']);  // Redirect to the home page
  }
}

export class AuthenticationBean {
  userRole?: string;
  userDetialsDto?: any;
  constructor(public token: string) { }
}
