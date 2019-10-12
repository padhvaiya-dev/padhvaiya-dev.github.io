import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service';
import {Router} from '@angular/router';

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
    private alertService: AlertService,
    private _router: Router
  ) {
    if(this._dataService.currentUserValue){
      this._router.navigateByUrl('/dashboard')
    }
  }

  onSignUp() {
    this._dataService.createUser(this.signUpForm.value)
      .subscribe(
        _ => {
          this.alertService.success('Signup successful! You can now login!');
        },
        err => {
          this.alertService.error(err);
        }
      )
  }

  onLogin() {
    this._dataService.login(this.loginForm.value)
      .subscribe(
        _ => {
          this.alertService.success('Login successful!');
          this._router.navigateByUrl('/dashboard');
        },
        err => {
          this.alertService.error(err)
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
