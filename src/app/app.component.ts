import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/footer/footer.component";
import { MenuComponent } from "./shared/menu/menu.component";
import { HeaderComponent } from "./shared/header/header.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, RouterOutlet, FooterComponent, MenuComponent, HeaderComponent]
})
export class AppComponent {
  title = 'Church Management Software';
}
