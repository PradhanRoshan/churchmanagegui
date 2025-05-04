import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFormControlValue, nullifyEmptyFormFields } from '../../../util/reactive-forms-util';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { EntitlementService } from '../../../core/services/entitlement.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidCredentials = true;
  isFormValid = true;
  isApplStsValid = false;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private entitlementService: EntitlementService
  ) {
  }

  ngOnInit(): void {

    this.createLoginForm();
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSignInClicked() {
    nullifyEmptyFormFields(this.loginForm);
    console.log(this.isFormValid)
    console.log(this.loginForm.valid)
    if (this.loginForm.valid) {
      this.isFormValid = true;
      console.log(this.loginForm.value)
      const username = getFormControlValue(this.loginForm, "username");
      const password = getFormControlValue(this.loginForm, "password");

      console.log(username + password)
      this.authService.login(this.loginForm.value)
        .subscribe(
          {
            next: (response) => {
              console.log("===================myResponse:===================", response);
              this.authService.authenticateUser(username, response.token);               
              
              this.isApplStsValid = this.entitlementService.isApplicationStsValid();

              if (!this.isApplStsValid) {

                console.log("I am inside of the routing ")
                this.router.navigate(['/dashboard/profile-setup']); // Replace memberId with the actual ID
              } else{

                this.router.navigate(['/dashboard']);  // Navigate to a protected route
              }

            },
            error: (e) => {
              this.invalidCredentials = false;
              console.error('Login failed', e)
            },
            complete: () => console.info('complete')
          }
        );
    } else {
      this.isFormValid = false;
      this.invalidCredentials = true;
    }

  }

  onSignUpClicked() {
    this.authService.logout();
    this.router.navigate(['/signup']);
  }

  // passwordReset() {
  //   this.router.navigate(['/reset-password']);
  //   }

}
