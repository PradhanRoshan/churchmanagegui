import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Role, RegistrationTracking } from '../../../core/model/registration-tracking.model';
import { MembersService } from '../../../core/services/members.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import { EntitlementService } from '../../../core/services/entitlement.service';
import { CommentsService } from '../../../core/services/comments.service';
import { Comments } from '../../../core/model/comments.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
  providers: [DatePipe],
})
export class ApplicationsComponent implements OnInit, OnDestroy {

  @ViewChild('newApplModal', { static: false }) modal!: ElementRef;

  // private bootstrapModal!: bootstrap.Modal;

  private destroy$ = new Subject<void>();

  newApplicationCount = 0;

  defaultRoleName: string;


  selectedRoleId = "";
  selectedRoleName = "";


  roles: Role[] = [
    { roleId: 1, roleName: 'Admin' },
    { roleId: 2, roleName: 'Member' },
    { roleId: 3, roleName: 'Volunteer' }
  ];
  registrationTracking: RegistrationTracking[] = [];
  allComments: Comments[] = [];
  comment = '';

  selectedObj: RegistrationTracking = null;

  newApplications: any[] = [];
  inProgressApplications: any[] = [];
  approvedApplications: any[] = [];
  rejectedApplications: any[] = [];
  readyApplications: any[] = [];
  modalTitle = '';
  modalStatus = '';


  constructor(
    private readonly datePipe: DatePipe,
    private membersService: MembersService,
    private commentsService: CommentsService,
    private entitlementService: EntitlementService,
  private router: Router,) { }

  ngOnInit(): void {
    this.refreshRegTrackingData();
    this.membersService.newAppCount$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (count) => {
        this.newApplicationCount = count;
      }
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
      case 'ready':
        this.readyApplications = this.registrationTracking.filter(item => item.applicationStatus.statusName === 'Ready');
        break;
      case 'rejected':
        this.rejectedApplications = this.registrationTracking.filter(item => item.applicationStatus.statusName === 'Rejected');
        console.log('Rejected this.rejectedApplications', this.rejectedApplications);
        break;
      case 'approved':
        console.log('Approved tab selected');
        this.approvedApplications = this.registrationTracking.filter(item => item.applicationStatus.statusName === 'Approved');
        console.log('Approved this.approvedApplications', this.approvedApplications);
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
    this.membersService.getRegistrationTracking().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: RegistrationTracking[]) => {
        this.registrationTracking = data;
        console.log('Data fetched:', this.registrationTracking);
        this.fetchData('new');
        this.fetchData('inprogress');
        this.fetchData('ready');
        this.fetchData('rejected');
        this.fetchData('approved');
      },
      error: (error) => {
        console.error('Error fetching registration tracking data:', error);
      }
    });


  }

  performAction(data: any, status: string) {
    // console.log('Performing action for:', data);
    console.log('Action:', status);
    this.selectedObj = data;
    this.defaultRoleName = data.role.roleName;
    this.modalStatus = status;
    switch (status) {
      case 'Submitted':
        // this.defaultRoleName = data.role.roleName;

        this.modalTitle = 'Review Member Details';


        // Handle Submitted action
        console.log('Handling Submitted action for:', data);

        break;
      case 'In Progress':
        // Handle In Progress action
        this.modalTitle = 'Application In Progress';

        console.log('Handling In Progress action for:', data);
        this.getAllCommentsForMember(data.userMember.memberId);
        break;
      case 'Ready':
        // Handle Ready action
        // Open modal to display information and Approve button, including address section

        this.modalTitle = 'Application Ready for Approval';


        // this.selectedObj = data;
        console.log('Handling Ready action for:', data);
        break;
      case 'Approved':
        // Handle Approved action
        console.log('Handling Approved action for:', data);
        this.router.navigate(['dashboard/applications/', data.userMember.memberId]);
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
  getAllCommentsForMember(memberId: any) {
    this.commentsService.getAllCommentsByMemberId(memberId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: any[]) => {
        console.log('Comments fetched:', response);
        // this.comments = response;
        this.allComments = response;
        console.log('All comments for member:', this.allComments);
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      }
    });
  }

   formatChatTimestamp(value: string | Date): string {
    if (!value) return '';
    // Output: 2024-01-15 10:30 AM
    return this.datePipe.transform(value, 'yyyy-MM-dd hh:mm a') ?? '';
  }

  startApplication(selectedObj) {
    console.log('Starting application for:', selectedObj);
    const payload = {
      memberId: selectedObj.userMember.memberId,
      role: selectedObj.role,
      applicationStatus: selectedObj.applicationStatus
    };

    console.log('Payload:', payload);


    this.membersService.reviewApplicationDecision(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Application started:', response);
        this.refreshRegTrackingData();
      },
      error: (error) => {
        console.error('Error starting application:', error);
      }
    });


  }

  rejectApplication(selectedObj: RegistrationTracking) {
    console.log('Reject application for:', selectedObj);

    const payload = {
      memberId: selectedObj.userMember.memberId,
      role: selectedObj.role,
      applicationStatus: { statusId: 5, statusName: 'Rejected' }
    };

    console.log('Payload:', payload);

    this.membersService.reviewApplicationDecision(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Application rejected:', response);
        this.refreshRegTrackingData();
        // this.fetchData('rejected'); 
      },
      error: (error) => {
        console.error('Error rejecting application:', error);
      }
    });


  }
  approveApplication(selectedObj: RegistrationTracking) {
    console.log('Approve application for:', selectedObj);
    const payload = {
      memberId: selectedObj.userMember.memberId,
      role: selectedObj.role,
      applicationStatus: { statusId: 4, statusName: 'Approved' }
    };

    console.log('Payload:', payload);

    this.membersService.reviewApplicationDecision(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Application approved:', response);
        this.refreshRegTrackingData();
        // this.fetchData('approved');
      },
      error: (error) => {
        console.error('Error approving application:', error);
        this.refreshRegTrackingData();
      }
    });

  }

  

  onCommentSentClick(arg0: RegistrationTracking) {
    console.log('Comment sent for:', arg0);
    // Implement comment sending logic here, e.g., open a modal to enter comments and send to backend
    console.log('Comment:', this.comment);

    let payload = {
      memberId: arg0.userMember.memberId,
      rgstrnRqstCmntRole: this.entitlementService.getUserRoleName(),
      nameRgstrnRqstCmntUser: this.entitlementService.getUserFullName(),
      textRgstrnRqstCmnt: this.comment
    };

    console.log('Payload for comment:', payload);
    this.commentsService.addComment(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Comment sent successfully:', response);
        if (response == 'Comments saved successfully') {
          this.getAllCommentsForMember(arg0.userMember.memberId);
        }
        this.comment = '';
        
      },
      error: (error) => {
        console.error('Error sending comment:', error);
      }
    });
  }

  handleAction(memberId: string) {
    alert(`Action clicked for Member ID: ${memberId}`);

  }

  // Close Bootstrap modal programmatically
  closeModal() {
    const modalElement = this.modal.nativeElement;
    // bootstrap.Modal.getInstance(modalElement)?.hide();
  }

  getColorBasedOnRole(role: string): string {
    switch (role) {
      case 'Admin':
        return 'text-danger';
      case 'Member':
        return 'text-success';
      case 'Volunteer':
        return 'text-warning';
      default:
        return 'text-muted';
    }
  }

  // Restore original role when modal is closed or X clicked
  onModalXClose(event) {
    if (this.selectedObj) {
      this.selectedObj.role.roleName = this.defaultRoleName;
      this.selectedRoleId = "";
      this.comment = '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

