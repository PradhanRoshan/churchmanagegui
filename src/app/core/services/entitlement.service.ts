import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntitlementService {


  constructor() { }

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

}


