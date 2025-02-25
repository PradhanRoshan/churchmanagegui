import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplHistory } from '../../../core/model/registration-tracking.model';
import { MembersService } from '../../../core/services/members.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UserDetails } from '../../../core/model/user-details.model';
import { AuthService } from '../../../core/services/auth.service';
import { EntitlementService } from '../../../core/services/entitlement.service';
import { of, delay } from 'rxjs';
import { Modal } from 'bootstrap';
// import 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-profile-setup',
  standalone:true,
  imports: [FormsModule,ReactiveFormsModule, NgClass, NgFor],
  templateUrl: './profile-setup.component.html',
  styleUrl: './profile-setup.component.scss'
})
export class ProfileSetupComponent implements OnInit {


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

  // Variable to hold the selected state
  selectedState: string = '';

  memberId: string;
  memberData:UserDetails;
  fullName:string;

  applHistory :ApplHistory[]=[];




  memberForm!: FormGroup;
  // states = ['New York', 'California', 'Texas', 'Florida', 'Illinois']; // Sample states

  // memberData = {
  //   member: {
  //     memberId: "MEM-16",
  //     emailId: "roshanshrestha1993@gmail.com",
  //     firstName: "Roshan",
  //     role: "Member",
  //     gender: null,
  //     lastName: "Pradhan",
  //     maritalStatus: null,
  //     phoneNumber: null,
  //     dttmCreate: "02-12-2025",
  //     memberDob: null,
  //     status: "Active",
  //     applicationSts: "In Progress",
  //     middleName: null
  //   },
  //   address: {
  //     aptNo: null,
  //     city: null,
  //     state: null,
  //     street: null,
  //     zip: null
  //   }
  // };

  constructor(private route:ActivatedRoute,
    private membersService:MembersService,
    private authService:AuthService,
    private entitlementService:EntitlementService,
    private fb: FormBuilder
  ){
  }
  ngOnInit(): void {

   
    
  this.getCurrentUserDetailsData();

  

  this.memberId=this.memberData.member.memberId;
  this.fullName=this.memberData.member.firstName + " "+ this.memberData.member.lastName
 
    this.getApplicationProgressDetial();

    this.initializeForm();
    
  }

   // Method to update the selected state
   onSelectState(state: string): void {
    this.selectedState = state;
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
        middleName: [this.memberData.member.middleName, Validators.required],
      }),
      address: this.fb.group({
        aptNo: [this.memberData.address.aptNo],
        city: [this.memberData.address.city, Validators.required],
        state: [this.memberData.address.state, Validators.required],
        street: [this.memberData.address.street, Validators.required],
        zip: [this.memberData.address.zip, [Validators.required, Validators.pattern(/^\d{5}$/)]]
      })
    });
  }

  openEditProfileModal(): void {
    const modal = new Modal(document.getElementById('editProfileModal')!);
    modal.show();
  }

  // onSubmit(): void {

  //   console.log("clickedsdfsadfasfdasfd")

  //   if (this.profileForm.invalid) {
  //     this.profileForm.markAllAsTouched();
  //     return;
  //   }

  //   const updatedProfile = {
  //     ...this.member,
  //     ...this.profileForm.value,
  //     address: {
  //       ...this.address,
  //       ...this.profileForm.value
  //     }
  //   };

  //   console.log("paylod", updatedProfile)

  //   // Call API to update profile
  //   this.updateProfile(updatedProfile).subscribe(() => {
  //     const modal = Modal.getInstance(document.getElementById('editProfileModal')!);
  //     modal.hide();
  //   });
  // }



  submitForm(): void {

    console.log("currentUserDetails", this.memberData);


    this.memberData.address=this.memberForm.value.address;
    // this.currentUserDetails.userMember.middleName=this.memberForm.


    console.log("After vaslue currentUserDetails", this.memberData);


    console.log("Member valid?", this.memberForm.valid);
    console.log("form Value", this.memberForm.value);

  

    if (this.memberForm.valid) {
 
      // Call API with formData
      // this.membersService.updateUserProfile(this.memberForm.value).subscribe(
      //   response => console.log('Successfully submitted', response),
      //   error => console.error('Error submitting form', error)
      // );
    } else {
      console.log('Form is invalid');
    }
  }

  updateProfile(profile: any) {
    // Simulate API call
    return of(profile).pipe(delay(1000));
  }


  getCurrentUserDetailsData() {
     // Subscribe to authService to keep user details updated
  this.authService.currentUser$.subscribe({
    next: (data) => {
      if (data) {
        console.log("Current UserDetails", data);
        this.memberData = data;
      } else {
        console.warn("User details reset to null, restoring from session storage.");
        const storedUser = this.entitlementService.getCurrentUserDetails();
        if (storedUser) {
          this.authService.setUserDetials(storedUser);
          this.memberData = storedUser;
        }
      }
    },
    error: (err) => {
      console.error("Error fetching current user details:", err);
    }
  });
  }

  formateDate(dateString: string) {
    const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date);
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
