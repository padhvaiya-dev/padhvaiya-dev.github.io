import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signUpForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _dataService: DataService,
    private alertService: AlertService
  ) {
  }

  onSignUp() {
    this._dataService.createUser(this.signUpForm.value)
      .subscribe(
        _ => {
          this.alertService.success('', 'Signup successful! You can now login!');
        },
        err => {
          this.alertService.error('Signup Error', err.error.message);
        }
      )
  }

  onLogin() {
    this._dataService.login(this.loginForm.value)
      .subscribe(
        respObj => {
          this.alertService.success('','Login successful!');
          console.log(respObj);
        },
        err => {
          this.alertService.error('Login Error', err.error.message)
        }
      )
  }

  ngOnInit() {
    this.signUpForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      password: ['']
    });
    this.loginForm = this._fb.group({
      email: [''],
      password: ['']
    })
  }

}
