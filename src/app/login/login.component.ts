import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service';
import { StateService } from '../services/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signUpForm: FormGroup;
  collegeList: any;
  @ViewChild('signInTab', { static: false }) public signInTab: ElementRef;
  @ViewChild('signInTab', { static: false }) public signUpTab: ElementRef;
  @ViewChild('signInTab', { static: false }) public signInBlock: ElementRef;
  @ViewChild('signInTab', { static: false }) public signUpBlock: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _dataService: DataService,
    private alertService: AlertService,
    private _router: Router,
    private _stateService: StateService,
    private _renderer: Renderer2
  ) {
    if (this._dataService.currentUserValue) {
      this._router.navigateByUrl('/home')
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
        respObj => {
          this.alertService.success('Login successful!');
          this._stateService.userState.userId = respObj['_id'];
          this._stateService.userState.email = respObj['email'];
          this._stateService.userState.firstName = respObj['first_name'];
          this._stateService.userState.lastName = respObj['last_name'];
          this._stateService.userState.questionList = respObj['questions'];
          this._stateService.userState.answerList = respObj['answers'];
          this._stateService.userState.questionsCount = respObj['questions'].length;
          this._stateService.userState.answersCount = respObj['answers'].length;
          this._router.navigateByUrl('/home');
        },
        err => {
          this.alertService.error(err)
        }
      )
  }

  ngOnInit() {
    this.fetchCollegeList();
    this.signUpForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      college:['', Validators.required],
      password: ['']
    });
    this.loginForm = this._fb.group({
      email: [''],
      password: ['']
    })
  }

  fetchCollegeList() {
    this._dataService.fetchCollegeList()
      .subscribe(respObj => {
        this.collegeList = respObj;
      }, err => {
        this.alertService.error(err)
      })
  }

  onToggleSignInSignUpTab(toggleParam: string) {
    switch (toggleParam) {
      case 'signIn': {
        this._renderer.removeClass(this.signUpTab.nativeElement, 'current');
        this._renderer.removeClass(this.signUpBlock.nativeElement, 'current');
        this._renderer.addClass(this.signInTab.nativeElement, 'current');
        this._renderer.addClass(this.signInBlock.nativeElement, 'current');
        break;
      }
      case 'signUp': {
        this._renderer.removeClass(this.signInTab.nativeElement, 'current');
        this._renderer.removeClass(this.signInBlock.nativeElement, 'current')
        this._renderer.addClass(this.signUpTab.nativeElement, 'current');
        this._renderer.addClass(this.signUpBlock.nativeElement, 'current');
        break;
      }
    }

  }

}
