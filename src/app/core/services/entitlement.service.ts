import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { MembersService } from './members.service';
import { UserDetails } from '../model/user-details.model';

@Injectable({
  providedIn: 'root'
})
export class EntitlementService {


  constructor(private authService:AuthService,
    private membersService:MembersService
  ) { }

  isApplicationStsValid():boolean {
    const invalidSts = ['In Progress', 'Rejected', 'Submitted'];
    return !invalidSts.includes(this.getApplicationStatus());
  }

  isUserRoleAdmin(): boolean {
    const roleName = this.getUserRoleName();
    return roleName === 'Admin' ? true : false;
  }

  isUserRoleMember(): boolean {
    const roleName = this.getUserRoleName();
    return roleName === 'Member' ? true : false;
  }

  isUserRoleManager(): boolean {
    const roleName = this.getUserRoleName();
    return roleName === 'Manager' ? true : false;
  }

  getUserRoleName() {
    const userDetails = sessionStorage.getItem('userDetials');
    if (userDetails) {
      const userDetailsObj = JSON.parse(userDetails);
      return userDetailsObj.role.roleName;
    }
    return null;  
  }
  getApplicationStatus() {
    const userDetails = sessionStorage.getItem('userDetials');
    if (userDetails) {
      const userDetailsObj = JSON.parse(userDetails);
      return userDetailsObj.member.applicationSts;
    }
    return null;  
  }

  getMemberId(): string | null {
    const userDetails = sessionStorage.getItem('userDetials');
    if (userDetails) {
      const userDetailsObj = JSON.parse(userDetails);
      return userDetailsObj.member?.memberId || null;  // Ensure `memberId` exists
    }
    return null;  
  }

  /**
   * ✅ Returns `true` if the address is missing
   */
  isAddressValid(): boolean {
    const userDetails = sessionStorage.getItem('userDetials');
    if (userDetails) {
      const userDetailsObj = JSON.parse(userDetails);
      return !!userDetailsObj.address; // Returns true if address exists, false if null/undefined
    }
    return false; // If no user details found, assume address is missing
  }

  getNewAppCount(): number {
    const storedValue = sessionStorage.getItem('newApplicationCount');
  
    // Validate and convert the value to a number
    const newAppCount: number = storedValue !== null && !isNaN(Number(storedValue)) 
      ? Number(storedValue) 
      : 0; // Default to 0 if invalid
  
    // Update count
    this.membersService.updateNewApplicationCount(newAppCount);
  
    return newAppCount;
  }

  getCurrentUserDetails(){
    const userDetailsObj = sessionStorage.getItem('userDetials');
    if (userDetailsObj) {
      const userDetails = JSON.parse(userDetailsObj);
      let userDetailData : UserDetails ={
        member: userDetails.member,
        role: userDetails.role,
        address: userDetails.address,
        user: userDetails.user
      }
      return userDetailData;
    }
    return null;
  }
  

}


