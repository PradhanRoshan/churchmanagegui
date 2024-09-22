import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss'
})
export class PaymentMethodComponent implements OnInit{

  constructor(){

  }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}