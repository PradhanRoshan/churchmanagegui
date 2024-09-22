import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss'
})
export class AddressListComponent implements OnInit{

  constructor(){

  }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
