
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { MembersService } from '../../services/members.service';
import { NgIf } from '@angular/common';
import { EntitlementService } from '../../services/entitlement.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf,RouterLink, RouterModule, TruncatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();
  loggedInUser:String;
  newApplicationsCount: number = 0;
  isUserRoleAdmin: boolean = false;
  isApplStsValid: boolean = false;
  memberId:string;
  hideIfAddIsInvalid:boolean =false;

  constructor(private authService: AuthService,
    private membersService: MembersService,
    private entitlementService: EntitlementService,
    private router:Router
  ){

  }
 


  ngOnInit(): void {
    this.loggedInUser=this.authService.getAuthenticatedUser();
    this.isUserRoleAdmin = this.entitlementService.isUserRoleAdmin();
    this.isApplStsValid = this.entitlementService.isApplicationStsValid();
    this.memberId=this.entitlementService.getMemberId();
    this.hideIfAddIsInvalid = this.entitlementService.isAddressValid();

    console.log("HIde address",this.hideIfAddIsInvalid)
    console.log("******************isStsvalid", this.isApplStsValid)

    this.membersService.newApplicationCount$.pipe(takeUntil(this.destroy$)).subscribe(count => {
      this.newApplicationsCount = count;
    });
  }

  logOut() {
    this.authService.logout();
  }


  ngOnDestroy() {
    // if (this.intervalId) {
    //   clearInterval(this.intervalId); // Clear the interval when the component is destroyed
    // }
    this.destroy$.next();
    this.destroy$.complete();
  }

}
