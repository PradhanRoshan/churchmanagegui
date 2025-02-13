import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/footer/footer.component";
import { MenuComponent } from "./shared/menu/menu.component";
import { HeaderComponent } from "./shared/header/header.component";
import { AuthService } from './services/auth.service';
import { SideNavComponent } from "./components/internal/side-nav/side-nav.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, RouterOutlet, HeaderComponent]
})
export class AppComponent implements OnInit{
  
  title = 'Church Management Software';

  showNavBar:boolean=false;

  constructor(private authService :AuthService,private router: Router){

  }
  

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(
      (loggedIn:boolean) =>{
        this.showNavBar = !loggedIn;
      }
    );

    
  }
}
