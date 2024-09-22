import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit{

  constructor(){

  }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
