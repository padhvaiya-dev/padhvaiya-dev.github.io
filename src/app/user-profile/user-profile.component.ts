import { Component, OnInit, Renderer2, ViewChild, ElementRef, Directive, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { StateService } from '../services/state.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';


@Directive({ selector: 'question-settings' })
export class QuestionSettings {
  @Input() id !: string;
}

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  currentUser = {};
  askQuestionForm: FormGroup
  isFirstActive: boolean = true;
  selectedFile: ImageSnippet;
  isDisabled: boolean = false;

  @ViewChild('quesTab', { static: false }) public quesTabEl: ElementRef;
  @ViewChild('ansTab', { static: false }) public ansTabEl: ElementRef;
  @ViewChild('userTab', { static: true }) public userTabEl: ElementRef;
  @ViewChild('productTab', { static: true }) public productTabEl: ElementRef;
  @ViewChild('questionSettings', { static: false }) public questionSettingsEl: ElementRef;
  @ViewChild('questionBox', { static: true }) public questionBox: ElementRef;


  userId: string;
  loggedInUser: string;
  constructor(
    private _dataService: DataService,
    public _stateService: StateService,
    private _renderer: Renderer2,
    private _fb: FormBuilder,
    private _notify: AlertService,
    private _route: ActivatedRoute,

  ) {
    this.userId = this._route.snapshot.paramMap.get('id').toString();
    this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'))._id;
    this.fetchUserDetails();
    this.fetchAnswersByUser();
    this.fetchQuestionsByUser();
  }

  ngOnInit() {
    this.currentUser = this._stateService.userState;
    this.askQuestionForm = this._fb.group({
      desc: ['', [Validators.required]]
    })
  }

  deleteQuestion(id: number) {
    this._dataService.deleteQuestionById(id)
      .subscribe(_ => {
        this.fetchQuestionsByUser();
      },
        err => {
          this._notify.error(err);
        })
  }

  deleteAnswer(id: string) {
    this._dataService.deleteAnswerById(id)
      .subscribe(_ => {
        this.fetchAnswersByUser();
      },
        err => {
          this._notify.error(err)
        })
  }

  fetchUserDetails() {
    this._dataService.fetchUserById(this.userId)
      .subscribe(respObj => {
        this._stateService.userState.email = respObj['email'];
        this._stateService.userState.firstName = respObj['first_name'];
        this._stateService.userState.lastName = respObj['last_name'];
      }, err => {
        this._notify.error(err);
      })
  }

  fetchQuestionsByUser() {
    this._dataService.fetchQuestionsByUser(this.userId)
      .subscribe(respObj => {
        this._stateService.userState.questionList = respObj;
        this._stateService.userState.questionsCount = this._stateService.userState.questionList.length;
      }, err => {
        this._notify.error(err);
      })
  }

  fetchAnswersByUser() {
    this._dataService.fetchAnswersByUser(this.userId)
      .subscribe(respObj => {
        this._stateService.userState.answerList = respObj;
        this._stateService.userState.answersCount = this._stateService.userState.answerList.length;
      }, err => {
        this._notify.error(err);
      })
  }

  onToggleQuestionAnswer(toggleParam: string) {
    switch (toggleParam) {
      case 'quesTab': {
        this._renderer.removeClass(this.ansTabEl.nativeElement, 'active');
        this._renderer.removeClass(this.productTabEl.nativeElement, 'current');
        this._renderer.addClass(this.quesTabEl.nativeElement, 'active');
        this._renderer.addClass(this.userTabEl.nativeElement, 'current');
        break;
      }
      case 'ansTab': {
        this._renderer.removeClass(this.quesTabEl.nativeElement, 'active');
        this._renderer.removeClass(this.userTabEl.nativeElement, 'current')
        this._renderer.addClass(this.ansTabEl.nativeElement, 'active');
        this._renderer.addClass(this.productTabEl.nativeElement, 'current');
        this.isFirstActive = false;
        break;
      }
    }

  }

}
