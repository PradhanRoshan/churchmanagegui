import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getFormControlValue, nullifyEmptyFormFields } from '../../../util/reactive-forms-util';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ NgIf,FormsModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  signUpForm: FormGroup;
  isPasswordValid=true;
  isUsernameValid=true;
  isEmailValid=true;
  isFormValid=true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService :AuthService,
  ){

  }
  
  ngOnInit(): void {
    this.createSignUpForm();
  }

  createSignUpForm() {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }


  signUp() {
    this.isPasswordValid = getFormControlValue(this.signUpForm,"password")===getFormControlValue(this.signUpForm,"confirmPassword")? true:false;
    nullifyEmptyFormFields(this.signUpForm);
    if(this.signUpForm.valid && this.isPasswordValid){
      const payload ={
        firstName: getFormControlValue(this.signUpForm,"firstName"),
        lastName: getFormControlValue(this.signUpForm,"lastName"),
        user:{
          username: getFormControlValue(this.signUpForm,"username"),
          email: getFormControlValue(this.signUpForm,"email"),
          password: getFormControlValue(this.signUpForm,"password"),
        }
      }
      console.log(this.signUpForm.value)
      console.log(payload)
      this.authService.signUp(payload).subscribe({
        next: (response) =>{
          console.log(response)
          if(response == "User registered successfully"){
            this.router.navigate(['/login']);
          } else if(response == "Username is already in use"){
            this.isUsernameValid=false;
          } else if(response == "Email is already in use"){
            this.isEmailValid=false;
          }
        },
        error: (e) =>{
          console.log(e);
        }
    });

    } else {
      this.isFormValid = false;
    }
    }
    signIn() {
      this.router.navigate(['/login']);
      }

}
