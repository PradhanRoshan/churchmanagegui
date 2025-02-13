import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RegistrationTracking, Role } from '../../model/registration-tracking.model';
import { MemberService } from '../../../services/member.service';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule,FormsModule, NgFor,NgClass],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {

  @ViewChild('newApplModal', { static: false }) modal!: ElementRef;

  // private bootstrapModal!: bootstrap.Modal;

  private destroy$ = new Subject<void>();

  newApplicationCount: number = 0;

  defaultRoleName: string;


  selectedRoleId: string = "";
  selectedRoleName: string = "";


  roles:Role[] = [
    { roleId: 1, roleName: 'Admin' },
    { roleId: 2, roleName: 'Member' },
    { roleId: 3, roleName: 'Volunteer' }
  ];
  registrationTracking: RegistrationTracking[] = [];

  selectedObj: RegistrationTracking = null;
  
  newApplications: any[] = [];
  inProgressApplications: any[] = [];
  approvedApplications: any[] = [];
  rejectedApplications: any[] = [];


  constructor(private memberService: MemberService, private http: HttpClient) {}
  ngOnInit(): void {
    this.refreshRegTrackingData();
    this.memberService.newApplicationCount$.pipe(takeUntil(this.destroy$)).subscribe(count => {
      this.newApplicationCount = count;
    });
  }

  fetchData(tab: string) {
    console.log(`Fetching data for================== ${tab}...`);

    switch (tab) {
      case 'new':
        this.newApplications = this.registrationTracking.filter(item => item.applicationStatus.statusName === 'Submitted');
        console.log('New Applications:===', this.newApplications);
        break;
      case 'inprogress':
        this.inProgressApplications = this.registrationTracking.filter(item => item.applicationStatus.statusName === 'In Progress');
        break;
      case 'rejected':
        this.rejectedApplications = this.registrationTracking.filter(item => item.applicationStatus.statusName === 'Rejected');
        break;
      case 'approved':
        this.approvedApplications = this.registrationTracking.filter(item => item.applicationStatus.statusName === 'Approved');
        break;
    }

  }

  updateRole(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
  
    // Find the selected role by roleId
    const selectedRole = this.roles.find(role => role.roleId.toString() === selectedId);
  
    if (selectedRole && this.selectedObj) {
      this.selectedObj.role.roleId = selectedRole.roleId; 
      this.selectedObj.role.roleName = selectedRole.roleName; // This updates the displayed role name
    }
}


  refreshRegTrackingData() {
    this.memberService.getRegistrationTracking().subscribe((data: RegistrationTracking[]) => {
      this.registrationTracking = data;
      console.log('Data fetched:', this.registrationTracking);
      this.fetchData('new');   
    });


  }

  performAction(data: any, status: string) {
    // console.log('Performing action for:', data);
    console.log('Action:', status);

    
    this.selectedObj = data;
    
    switch (status) {
      case 'Submitted':
        this.defaultRoleName = data.role.roleName;
          // Handle Submitted action
        console.log('Handling Submitted action for:', data);

        break;
      case 'In Progress':
          // Handle In Progress action
        console.log('Handling In Progress action for:', data);
        break;
      case 'Approved':
          // Handle Approved action
          console.log('Handling Approved action for:', data);
          break;
      case 'Rejected':
          // Handle Rejected action   
          console.log('Handling Rejected action for:', data);
          break;
      default:
        console.log('Unknown action:', status);
        break;
    }
  }

  startApplication(selectedObj) {
    console.log('Starting application for:', selectedObj);
    let payload = {
      memberId: selectedObj.userMember.memberId,
      role : selectedObj.role,
      applicationStatus: { statusId: 2, statusName: 'In Progress' }
    };

    console.log('Payload:', payload);


    this.memberService.reviewApplicationDecision(payload).subscribe(response => {
      console.log('Application started:', response);
      this.refreshRegTrackingData();

    }, error => {
      console.error('Error starting application:', error);

    });
    
    
  }


  handleAction(memberId: string) {
    alert(`Action clicked for Member ID: ${memberId}`);
    
  }

  // Close Bootstrap modal programmatically
  closeModal() {
    const modalElement = this.modal.nativeElement;
    bootstrap.Modal.getInstance(modalElement)?.hide();
  }


  
  // Restore original role when modal is closed or X clicked
  onModalXClose(event) {
    if (this.selectedObj) {
      this.selectedObj.role.roleName = this.defaultRoleName;
      this.selectedRoleId = "";
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
