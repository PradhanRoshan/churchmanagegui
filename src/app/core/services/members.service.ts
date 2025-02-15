import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { API_URL } from '../../../environments/environment';
import { RegistrationTracking } from '../model/registration-tracking.model';

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
  

  constructor(private http: HttpClient) { }

  
  get newApplicationCount$(): Observable<number> {
    return this.newApplicationCount.asObservable();
  }
  
  // Function to update the count
  updateNewApplicationCount(count: number): void {
    this.newApplicationCount.next(count);
  }

  getRegistrationTracking() :Observable<RegistrationTracking[]> {
    return this.http.get<RegistrationTracking[]>(this.baseUrl + "/member/registration-tracking").pipe(
      map((data: RegistrationTracking[]) => {
        console.log('Data fetched from API:', data);
        const newApplicationCount = data.filter(item => item.applicationStatus.statusName === 'Submitted').length;
        this.updateNewApplicationCount(newApplicationCount);
        return data;
      })
    );
  }

  reviewApplicationDecision(payload: { memberId: any; role: any; applicationStatus: { statusId: number; statusName: string; }; }) {
    return this.http.post(this.baseUrl + "/member/review-application", payload, this.textResponse);
  }
}
