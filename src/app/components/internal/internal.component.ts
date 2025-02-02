import { Component } from '@angular/core';
import { SideNavComponent } from "./side-nav/side-nav.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-internal',
  standalone: true,
  imports: [SideNavComponent,RouterOutlet],
  templateUrl: './internal.component.html',
  styleUrl: './internal.component.scss'
})
export class InternalComponent {

}
