import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplHistory, RegistrationTracking } from '../../../core/model/registration-tracking.model';
import { MembersService } from '../../../core/services/members.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { UserDetails } from '../../../core/model/user-details.model';
import { AuthService } from '../../../core/services/auth.service';
import { EntitlementService } from '../../../core/services/entitlement.service';
import { Subject, takeUntil } from 'rxjs';
import { Modal } from 'bootstrap';
import { Comments } from '../../../core/model/comments.model';
import { CommentsService } from '../../../core/services/comments.service';


@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgFor, NgIf,FormsModule],
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss'],
  providers: [DatePipe],
})
export class ProfileSetupComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  isPageReady = false;

  // List of US states
  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  selectedState = '';
  memberId = '';
  memberData: UserDetails = {} as UserDetails;
  fullName = '';
  memberSince = '';
  applHistory: ApplHistory[] = [];
  memberForm!: FormGroup;
  allComments: Comments[] = [];
  comment = '';
  commentsDisabled = false;

  constructor(
    private route: ActivatedRoute,
     private readonly datePipe: DatePipe,
     private commentsService: CommentsService,
    private membersService: MembersService,
    private authService: AuthService,
    private entitlementService: EntitlementService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.initializeForm();
    this.memberId = this.entitlementService.getMemberId();
    this.getCurrentUserDetailsData();
    this.getApplicationProgressDetail();
    this.getAllCommentsForMember(this.memberId);
  }

  initializeForm(): void {
    this.memberForm = this.fb.group({
      member: this.fb.group({
        memberId: [this.memberData.member.memberId],
        emailId: [this.memberData.member.emailId],
        firstName: [this.memberData.member.firstName],
        role: [ this.memberData.role.roleName],
        lastName: [this.memberData.member.lastName ],
        dttmCreate: [ this.memberData.member.dttmCreate ],
        status: [this.memberData.member.status ],
        applicationSts: [this.memberData.member.applicationSts],
        gender: [this.memberData.member.gender, Validators.required],
        maritalStatus: [this.memberData.member.maritalStatus, Validators.required],
        phoneNumber: [this.memberData.member.phoneNumber, [Validators.required, Validators.pattern(/^\d{10}$/)]],
        memberDob: [this.memberData.member.memberDob, Validators.required],
        middleName: [this.memberData.member.middleName,],
      }),
      address: this.fb.group({
        aptNo: [this.memberData?.address?.aptNo ?? ''],
        city: [this.memberData?.address?.city ?? '', Validators.required],
        state: [this.memberData?.address?.state ?? '', Validators.required],
        street: [this.memberData?.address?.street ?? '', Validators.required],
        zip: [this.memberData?.address?.zip ?? '', [Validators.required, Validators.pattern(/^\d{5}$/)]]
      })
    });
  }

  openEditProfileModal(): void {
    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.initializeForm();
      modal.show();
    }
  }

  closeEditProfileModal(): void {
    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        // modal.dispose();
        modal.hide();
      }
    }
  
    // Manually remove the backdrop if it persists
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
  
  

  submitForm(): void {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    console.log("Form Data:", this.memberForm.value);

    // Mock API call
    this.membersService.updateUserProfile(this.memberForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log("Update response:", response);
        
        if (response === "Successfully updated user profile") {
          this.getCurrentUserDetailsData(); // Refresh data
          this.closeEditProfileModal(); // Close modal
        }
      },
      error: (error) => {
        console.error("Error updating profile:", error);
      }
    });
  }

  getCurrentUserDetailsData() {
    this.authService.getUserDetailsInfo(this.memberId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (data) {
          console.log("Fetched User Data:", data);
          this.memberData = data;
          // this.isPageReady = true;
          this.fullName = `${this.memberData.member.firstName} ${this.memberData.member.lastName}`;
          this.memberSince = this.formatDate(this.memberData.member.dttmCreate);
          this.initializeForm();
          this.commentsDisabled = this.memberData.member.applicationSts == 'Rejected' || this.memberData.member.applicationSts == 'Approved';
          this.isPageReady = true;
        } else {
          console.warn("User details reset to null, restoring from session storage.");
          const storedUser = this.entitlementService.getCurrentUserDetails();
          if (storedUser) {
            this.authService.setUserDetials(storedUser);
            this.memberData = storedUser;
            this.initializeForm();
            this.isPageReady = true;
          }
        }
      },
      error: (err) => {
        console.error("Error fetching user details:", err);
      }
    });
  }

  formatDate(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date);
  }

  getApplicationProgressDetail() {
    this.membersService.getAppProcHistory(this.memberId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (historyList) => {
        this.applHistory = historyList;
      },
      error: (error) => {
        console.error("Error fetching application history:", error);
      }
    });
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

  
    onCommentSentClick() {
      if (this.commentsDisabled) return;
      
      // Implement comment sending logic here, e.g., open a modal to enter comments and send to backend
      console.log('Comment:', this.comment);
  
      let payload = {
        memberId: this.memberId,
        rgstrnRqstCmntRole: this.entitlementService.getUserRoleName(),
        nameRgstrnRqstCmntUser: this.entitlementService.getUserFullName(),
        textRgstrnRqstCmnt: this.comment
      };
  
      console.log('Payload for comment:', payload);
      this.commentsService.addComment(payload).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          console.log('Comment sent successfully:', response);
          if (response == 'Comments saved successfully') {
            this.getAllCommentsForMember(this.memberId);
          }
          this.comment = '';
          
        },
        error: (error) => {
          console.error('Error sending comment:', error);
        }
      });
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
