import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit{

  loggedInUserName:string="";

 
   constructor(private router: Router, private authService :AuthService) {
   }

  ngOnInit(): void {
    this.loggedInUserName=this.authService.getAuthenticatedUser();
    
  }

// Nevigation Functions
  onOrderClickec() {
    this.router.navigate(['/internal/members']);
  }

  onHomeClick() {
    this.router.navigate(['/internal']);
    }
  onDashboardClick() {
    this.router.navigate(['/internal/dashboard']);
    }

  logOut() {
    this.authService.logout();
  }
  activateTab() {
    return "nav-link active";
  }

}
