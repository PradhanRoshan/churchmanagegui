import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { getFormControlValue, nullifyEmptyFormFields } from '../../../util/reactive-forms-util';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgIf,FormsModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  // encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit{


  resetPswdForm: FormGroup;
  isNewPasswordValid: boolean=true;
  isUsernameValid: boolean=true;
  isFormValid: boolean=true;

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
      username: ['', Validators.required],
      email: ['', Validators.required],
      newPassword: ['', Validators.required],
      newCnfrmPassword: ['', Validators.required],
    });
  }

  onResetClicked() {
    nullifyEmptyFormFields(this.resetPswdForm);
    this.isNewPasswordValid = getFormControlValue(this.resetPswdForm,"newPassword")===getFormControlValue(this.resetPswdForm,"newCnfrmPassword")? true:false;
    if(this.resetPswdForm.valid && this.isNewPasswordValid){
      this.isFormValid = true;
      console.log(this.resetPswdForm.value)
      let payload = {
          username: getFormControlValue(this.resetPswdForm,"username"),
          email: getFormControlValue(this.resetPswdForm,"email"),
          password: getFormControlValue(this.resetPswdForm,"newPassword"),
      }

      this.authService.resetUserPassword(payload)
      .subscribe(
        {
          next: (response) => {
            console.log(response);
            if(response=="User not found"){
              this.isUsernameValid=false;
              return;
            } else if(response=="Password changed successfully"){
              this.isUsernameValid=true;
              this.router.navigate(['/login']);
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

      console.log(payload)

    }else {
      this.isFormValid = false;
    }

    }

}
