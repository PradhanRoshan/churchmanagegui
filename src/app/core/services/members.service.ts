import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environment';
import { ApplHistory, RegistrationTracking } from '../model/registration-tracking.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
 
  baseUrl = API_URL;

  requestOptions ={
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*',
    }),
  }

  textResponse = {
    responseType: 'text' as 'json'
  }

  // Track the number of new applications
    private newApplicationCount = new BehaviorSubject<number> (0);
    newAppCount$ = this.newApplicationCount.asObservable().pipe(distinctUntilChanged());
  

  constructor(private http: HttpClient) { }

  getCurrentNewAppCount(): number {
    return this.newApplicationCount.value;
  }
  
  // Function to update the count
  updateNewApplicationCount(count: number): void {
    if (this.newApplicationCount.value !== count) {
      sessionStorage.setItem('newApplicationCount', count.toString()); // 🔥 Always update session storage
      console.log('Updated newApplicationCount:', count);
      this.newApplicationCount.next(count);
    }
  }
  

  getRegistrationTracking(): Observable<RegistrationTracking[]> {
    return this.http.get<RegistrationTracking[]>(`${this.baseUrl}/member/registration-tracking`).pipe(
      map((data: RegistrationTracking[]) => {
        console.log('Data fetched from API:', data);
        const newApplicationCount = data.filter(item => item.applicationStatus.statusName === 'Submitted').length;
        this.updateNewApplicationCount(newApplicationCount);
  
        return data;
      })
    );
  }

  updateUserProfile(payload: any) {
  return this.http.post(this.baseUrl + "/member/update-user-profile", payload, this.textResponse);
  }

  reviewApplicationDecision(payload: any) {
    return this.http.post(this.baseUrl + "/member/review-application", payload, this.textResponse);
  }

  getAppProcHistory(memberId: string): Observable<ApplHistory[]> {
    return this.http.get<ApplHistory[]>(`${this.baseUrl}/member/application-progress/${memberId}`);
  }
  
}
