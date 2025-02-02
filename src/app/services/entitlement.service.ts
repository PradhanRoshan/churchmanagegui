import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntitlementService {


  constructor() { }

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


}


