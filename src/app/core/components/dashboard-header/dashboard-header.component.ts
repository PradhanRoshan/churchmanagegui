import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { EntitlementService } from '../../services/entitlement.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-header',
  imports: [TruncatePipe],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent implements OnInit{

  private destroy$ = new Subject<void>();

  loggedInUser: string;
  isUserRoleAdmin: boolean = false;

  // Displaying loggined time
  loginDuration: string = ''; // Duration in minutes
  intervalId: any;
  currentTime: string = '';

  constructor(private router: Router, 
    private authService: AuthService,
    private entitlementService: EntitlementService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser=this.authService.getAuthenticatedUser();
    this.isUserRoleAdmin = this.entitlementService.isUserRoleAdmin();

    this.userLoggedInTime();
  }

  onLogoClicked(){
    this.router.navigate(['/dashboard']);
  }

  logOut() {
    this.authService.logout();
  }


  // Method to pad single digits with a leading zero
  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }


  // User Logged In time calculation 

  userLoggedInTime() {
    const loginTime = sessionStorage.getItem('loginTime');

    if (loginTime) {
      this.intervalId = setInterval(() => {
        // Calculate login duration as before
        const currentTime = new Date().getTime();
        const loggedInTimeInMilliseconds = currentTime - parseInt(loginTime, 10);

        const hoursDuration = Math.floor(loggedInTimeInMilliseconds / (1000 * 60 * 60));
        const minutesDuration = Math.floor((loggedInTimeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const secondsDuration = Math.floor((loggedInTimeInMilliseconds % (1000 * 60)) / 1000);

        this.loginDuration = `${this.padZero(hoursDuration)}:${this.padZero(minutesDuration)}:${this.padZero(secondsDuration)}`;

        // Get current time in 12-hour format
        const now = new Date();
        const hours = now.getHours();
        const minutes = this.padZero(now.getMinutes());
        const seconds = this.padZero(now.getSeconds());

        // Convert 24-hour format to 12-hour format
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 0 hour to 12 for 12 AM/PM

        this.currentTime = `${formattedHours}:${minutes}:${seconds} ${period}`;
      }, 1000); // Update every second
    }
  }


  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval when the component is destroyed
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

}
