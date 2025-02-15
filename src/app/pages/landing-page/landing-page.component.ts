import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LandingHeaderComponent } from "../../core/components/landing-header/landing-header.component";
import { FooterComponent } from "../../core/components/footer/footer.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingHeaderComponent, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  constructor(private router: Router) { }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}
