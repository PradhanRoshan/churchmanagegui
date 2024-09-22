import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

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
