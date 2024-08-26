import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule,NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{
 username: string;


  constructor(private router: Router, private authService :AuthService) {
  }
  ngOnInit(): void {
    this.username=this.authService.getAuthenticatedUser();
  }

  logOut() {
    this.authService.logout();
  }


  
  


}
