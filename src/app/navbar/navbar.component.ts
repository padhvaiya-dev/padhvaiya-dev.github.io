import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { DataService } from './../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { StateService } from '../services/state.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isDisabled: boolean = false;
  @ViewChild('userSettings', { static: true }) private userSettingsEl: ElementRef;
  @ViewChild('quesTab', { static: false }) public quesTabEl: ElementRef;
  @ViewChild('ansTab', { static: false }) public ansTabEl: ElementRef;
  @ViewChild('closeButton', { static: false }) public closeButtonEl: ElementRef;

  askQuestionForm: FormGroup
  userLoggedIn: string = 'Guest';
  constructor(
    private _dataService: DataService,
    private _renderer: Renderer2,
    private _fb: FormBuilder,
    private _stateService: StateService,
    private _notify: AlertService
  ) { }

  ngOnInit() {
    this.userLoggedIn = localStorage.getItem('loggedInUser');
    this.askQuestionForm = this._fb.group({
      desc: ['', [Validators.required]]
    })
  }

  goLogout() {
    this._dataService.logout();
  }

  fetchUserDetails() {
    this._dataService.fetchLoggedInUserId()
      .subscribe(respObj => {
        const userId: number = respObj['id'];
        this._dataService.fetchUserById(userId)
          .subscribe(respObj => {
            this._stateService.userState.userId = respObj['id'];
            this._stateService.userState.email = respObj['email'];
            this._stateService.userState.firstName = respObj['firstName'];
            this._stateService.userState.lastName = respObj['lastName'];
            this._stateService.userState.questionList = respObj['questions'];
            this._stateService.userState.answerList = respObj['answers'];
            this._stateService.userState.questionsCount = respObj['questions'].length;
            this._stateService.userState.answersCount = respObj['answers'].length;
          }, err => {
            this._notify.error(err);
          })
      },
        err => {
          this._notify.error(err)
        })
  }

  onNewQuestionSubmit() {
    const userId: number = this._stateService.userState.userId;
    if (!this.askQuestionForm.valid) this._notify.warning('Question cannot be empty');
    this._dataService.createQuestionByUser(this.askQuestionForm.value, userId)
      .subscribe(_ => {
        this._notify.info('You asked a question!');
        this.fetchUserDetails();
        this.closeButtonEl.nativeElement.click();
      },
        err => {
          this._notify.error(err);
        })
  }

  onToggleProfile() {
    this.isDisabled = !this.isDisabled;
    this.isDisabled
      ? this._renderer.addClass(this.userSettingsEl.nativeElement, 'active')
      : this._renderer.removeClass(this.userSettingsEl.nativeElement, 'active');
  }
}
