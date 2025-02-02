import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common';
import { getFormControlValue, nullifyEmptyFormFields } from '../../../util/reactive-forms-util';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf,FormsModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  resetPswdForm: FormGroup;
  isNewPasswordValid: boolean=true;
  isCurrentPasswordValid: boolean=true;
  isFormValid: boolean=true;
  passwordUpdated: boolean=false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService :AuthService,
  ){

  }
  
  ngOnInit(): void {
    this.createPswdResetFormForm();
  }

  createPswdResetFormForm() {
    this.resetPswdForm = this.fb.group({

      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newCnfrmPassword: ['', Validators.required],
    });
  }

  onTabChange(tabId: string): void {
    console.log("tabName", tabId)
    // Handle tab change and reset forms if necessary
    if (tabId === '#profile-change-password') {
      this.resetForms();  // Reset the forms when these tabs are clicked
    }
  }
  
  resetForms(): void {
    // Add form reset logic here for each form in the tabs
    this.isNewPasswordValid=true;
  this.isCurrentPasswordValid =true;
  this.isFormValid =true;
  this.passwordUpdated =false;
    if (this.resetPswdForm) {
      this.resetPswdForm.reset();  // Example: Reset the password form
    }
  }


  onPasswordResetClicked() {
    console.log("reset: ",this.resetPswdForm.value)
    nullifyEmptyFormFields(this.resetPswdForm);
    // this.isNewPasswordValid = ;
    if(!(getFormControlValue(this.resetPswdForm,"newPassword") === getFormControlValue(this.resetPswdForm,"newCnfrmPassword"))){
      this.isNewPasswordValid=false;
      return;
    } else{
      this.isNewPasswordValid=true;
    }
    if(this.resetPswdForm.valid && this.isNewPasswordValid){
      this.isFormValid = true;

      let payload = {
        username: this.authService.getAuthenticatedUser(),
        password: getFormControlValue(this.resetPswdForm, "newPassword"),
        currentPassword: getFormControlValue(this.resetPswdForm, "currentPassword"),
        }

        this.authService.resetUserPassword(payload)
      .subscribe(
        {
          next: (response) => {
            console.log(response);
            if(response=="Incorrect current password"){
              this.isCurrentPasswordValid=false;
              return;
            } else if(response=="Password changed successfully"){
              this.passwordUpdated=true;
              this.resetPswdForm.reset();
              // window.location.reload();
              // this.router.navigate(['/internal/profile']);
            }
            // this.authService.authenticateUser(username, response.token);  // Store user and token
            // console.log(this.authService.getAuthenticatedUserRole());

           
          },
          error: (e) => {
            // this.invalidCredentials = true;
            console.error('Login failed', e)
          },
          complete: () => console.info('complete')
        }
      );

    } else{
      this.passwordUpdated=false;
      this.isFormValid=false;
      this.isCurrentPasswordValid=true;
      
    }



    }



}
