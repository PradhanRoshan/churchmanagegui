import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  private sideNavTabNam = new BehaviorSubject<string> ('Main Home');
  constructor() { }

  get sideNavTabName(): Observable<string>{
    return this.sideNavTabNam.asObservable();
  }

  updateSideNavTabValue(value:string): void{
    this.sideNavTabNam.next(value);
  }

}
