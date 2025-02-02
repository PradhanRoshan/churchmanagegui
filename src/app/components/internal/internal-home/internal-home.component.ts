import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-internal-home',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './internal-home.component.html',
  styleUrl: './internal-home.component.scss'
})
export class InternalHomeComponent implements OnInit {

  completeProfileSetUp: boolean = false;
  userDetials: any;


  ngOnInit(): void {
    this.completeProfileSetup();
  }
  completeProfileSetup() {
    let userString = sessionStorage.getItem('userDetials');
    this.userDetials = JSON.parse(userString);

    console.log("address is null", this.userDetials)

    if (this.userDetials.address == null) {
      const exampleModal = document.getElementById('exampleModal')
      
      




      // myModalEl.addEventListener('hidden.bs.modal', event => {
      //   // do something...
      // })
      this.completeProfileSetUp = true;
    }

  }

}
