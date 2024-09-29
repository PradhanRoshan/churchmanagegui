import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SideNavService } from '../../../services/side-nav.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit, OnDestroy {

  loggedInUserName: string = "";
  navHeadName: string = "";

  loginDuration: string = ''; // Duration in minutes
  intervalId: any;
  currentTime: string = '';


  constructor(private router: Router,
    private authService: AuthService,
    private sideNavService: SideNavService) {
  }

  ngOnInit(): void {
    this.loggedInUserName = this.authService.getAuthenticatedUser();
    this.sideNavService.sideNavTabName.subscribe(data => {
      this.navHeadName = data;
    });
    this.onHomeClick();
    this.userLoggedInTime();
  }

  // Nevigation Functions
  onOrderClickec() {
    this.sideNavService.updateSideNavTabValue("Order");
    this.router.navigate(['/internal/members']);
  }

  onHomeClick() {
    this.sideNavService.updateSideNavTabValue("Main Home");
    this.router.navigate(['/internal']);
  }
  onDashboardClick() {
    this.sideNavService.updateSideNavTabValue("Dashboard");
    this.router.navigate(['/internal/dashboard']);
  }

  logOut() {
    this.authService.logout();
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

  // Method to pad single digits with a leading zero
  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval when the component is destroyed
    }
  }

}
