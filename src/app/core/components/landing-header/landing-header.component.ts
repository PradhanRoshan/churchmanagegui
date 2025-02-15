// import { Component } from '@angular/core';

// @Component({
//   standalone: true,
//   selector: 'app-landing-header',
//   template: `
//     <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
//       <div class="container">
//         <a class="navbar-brand" routerLink="/">Church Management</a>
//         <div class="d-flex">
//           <a class="btn btn-light me-2" routerLink="/login">Login</a>
//           <a class="btn btn-outline-light" routerLink="/signup">Signup</a>
//         </div>
//       </div>
//     </nav>
//   `,
// })
// export class LandingHeaderComponent {}




import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  imports: [],
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss'
})
export class LandingHeaderComponent implements OnInit{

  constructor(private router: Router){
  
  }
  
  ngOnInit(): void {
     
  }
  
  onSignUpClicked() {
    this.router.navigate(['/signup']);
  }
  
  onLoginClicked() {
    this.router.navigate(['/login']);  // Redirect to the login page
  }
  
  }