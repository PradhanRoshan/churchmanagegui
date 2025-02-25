// import { Component } from '@angular/core';

// @Component({
//   standalone: true,
//   selector: 'app-footer',
//   template: `
//     <footer class="footer">
//       <div class="container text-center">
//         <span>&copy; {{ currentYear }} Church Management. All Rights Reserved.</span>
//       </div>
//     </footer>
//   `,
//   styles: [
//     `
//     .footer {
//       bottom: 0;
//       width: 100%;
//       background: #f8f9fa;
//       padding: 10px 0;
//       text-align: center;
//       border-top: 1px solid #ddd;
//     }
//     `
//   ]
// })
// export class FooterComponent {
//   currentYear = new Date().getFullYear();
// }





import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  currentYear = new Date().getFullYear();

}
