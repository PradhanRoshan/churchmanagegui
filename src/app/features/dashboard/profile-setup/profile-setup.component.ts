import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplHistory } from '../../../core/model/registration-tracking.model';
import { MembersService } from '../../../core/services/members.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UserDetails } from '../../../core/model/user-details.model';
import { AuthService } from '../../../core/services/auth.service';
import { EntitlementService } from '../../../core/services/entitlement.service';

@Component({
  selector: 'app-profile-setup',
  standalone:true,
  imports: [FormsModule, NgClass, NgFor],
  templateUrl: './profile-setup.component.html',
  styleUrl: './profile-setup.component.scss'
})
export class ProfileSetupComponent implements OnInit {

  memberId: string;
  currentUserDetails:UserDetails;
  fullName:string;

  applHistory :ApplHistory[]=[];

  constructor(private route:ActivatedRoute,
    private membersService:MembersService,
    private authService:AuthService,
    private entitlementService:EntitlementService
  ){

  }
  ngOnInit(): void {
    
this.getCurrentUserDetailsData();

  this.memberId=this.currentUserDetails.userMember.memberId;
  this.fullName=this.currentUserDetails.userMember.firstName + " "+ this.currentUserDetails.userMember.lastName

    
    this.getApplicationProgressDetial();
  }

  
  getCurrentUserDetailsData() {
     // Subscribe to authService to keep user details updated
  this.authService.currentUser$.subscribe({
    next: (data) => {
      if (data) {
        console.log("Current UserDetails", data);
        this.currentUserDetails = data;
      } else {
        console.warn("User details reset to null, restoring from session storage.");
        const storedUser = this.entitlementService.getCurrentUserDetails();
        if (storedUser) {
          this.authService.setUserDetials(storedUser);
          this.currentUserDetails = storedUser;
        }
      }
    },
    error: (err) => {
      console.error("Error fetching current user details:", err);
    }
  });
  }


  getApplicationProgressDetial() {
    this.membersService.getAppProcHistory(this.memberId).subscribe({
      next: (historyList) => {
        this.applHistory=historyList;
      },
      error: (error) => {
        
      },
      complete: () => {
        console.log('Request completed')
      }
    });
  }

}
