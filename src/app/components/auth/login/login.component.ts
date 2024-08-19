import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { getFormControlValue, nullifyEmptyFormFields } from '../../../util/reactive-forms-util';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService :AuthService
  ){
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
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
      let username = getFormControlValue(this.loginForm,"username");
      let password = getFormControlValue(this.loginForm,"password");

      console.log(username + password)
      this.authService.executeAutheticationServicea(this.loginForm.value)
       .subscribe(
        {
          next: (response) => {
            console.log(response); 
            this.authService.authenticateUser(username, response.token);  // Store user and token
            this.router.navigate(['/home']);  // Navigate to a protected route
          },
          error: (e) => console.error('Login failed', e),
          complete: () => console.info('complete') 
      }
      );
    }
    
  }

}
