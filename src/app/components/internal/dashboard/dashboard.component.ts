import { Component, OnInit } from '@angular/core';
import { SideNavComponent } from "../side-nav/side-nav.component";
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from "../../../shared/menu/menu.component";
import { AuthService } from '../../../services/auth.service';
import { SideNavService } from '../../../services/side-nav.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideNavComponent, RouterOutlet, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  pageTitle: string;

  constructor(private router: Router,
    private authService: AuthService,
    private sideNavService: SideNavService) {
  }

  ngOnInit(): void {
    this.sideNavService.sideNavTabName.subscribe(data => {
      this.pageTitle = data;
    });

  }

}
