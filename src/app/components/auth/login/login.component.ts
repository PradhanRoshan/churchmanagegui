import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFormControlValue, nullifyEmptyFormFields } from '../../../util/reactive-forms-util';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidCredentials: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
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
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      let username = getFormControlValue(this.loginForm, "username");
      let password = getFormControlValue(this.loginForm, "password");

      console.log(username + password)
      this.authService.login(this.loginForm.value)
        .subscribe(
          {
            next: (response) => {
              console.log(response);
              this.authService.authenticateUser(username, response.token);  // Store user and token
              console.log(this.authService.getAuthenticatedUserRole());
              this.router.navigate(['/internal']);  // Navigate to a protected route
             
            },
            error: (e) => {
              this.invalidCredentials = true;
              console.error('Login failed', e)
            },
            complete: () => console.info('complete')
          }
        );
    }

  }

  onSignUpClicked() {
    this.authService.logout();
    this.router.navigate(['/signup']);
  }

}
