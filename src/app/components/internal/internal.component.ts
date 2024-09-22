import { Component } from '@angular/core';
import { SideNavComponent } from "./side-nav/side-nav.component";

@Component({
  selector: 'app-internal',
  standalone: true,
  imports: [SideNavComponent],
  templateUrl: './internal.component.html',
  styleUrl: './internal.component.scss'
})
export class InternalComponent {

}
