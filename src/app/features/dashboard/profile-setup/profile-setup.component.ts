import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplHistory } from '../../../core/model/registration-tracking.model';
import { MembersService } from '../../../core/services/members.service';

@Component({
  selector: 'app-profile-setup',
  standalone:true,
  imports: [],
  templateUrl: './profile-setup.component.html',
  styleUrl: './profile-setup.component.scss'
})
export class ProfileSetupComponent implements OnInit {

  memberId: string;

  applHistory :ApplHistory[]=[];

  constructor(private route:ActivatedRoute,
    private membersService:MembersService
  ){

  }
  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    this.getApplicationProgressDetial();
  }


  getApplicationProgressDetial() {
    this.membersService.getAppProcHistory(this.memberId).subscribe({
      next: (historyList) => {
        this.applHistory=historyList;
      },
      error: (error) => {
        
      },
      complete: () => {
        console.log('Request completed')
      }
    });
  }

}
