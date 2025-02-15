import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit{

  isUserLoggedIn: boolean=false;
  constructor(private authService: AuthService,private router:Router){

  }

  ngOnInit(): void {
    this.isUserLoggedIn=this.authService.isUserLoggedIn();
  }



  onGoBack(){
    // loggedIn user clicked  go back it will logout
  if(this.isUserLoggedIn){
    this.authService.logout();
  }
  this.router.navigate(['/']);
  }


}
