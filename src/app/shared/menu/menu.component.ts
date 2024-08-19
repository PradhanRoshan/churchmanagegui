import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{


  constructor(private router: Router, private authService :AuthService) {
  }
  ngOnInit(): void {
    
  }

  logOut() {
    this.authService.logout();
  }


  
  


}
