import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service';
import { StateService } from '../services/state.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {

  questionId: number;
  questionDesc: string;
  answerCount: number;
  answerList: Array<object>;
  answerForm: FormGroup
  @ViewChild('closeButton', { static: false }) public closeButtonEl: ElementRef;
  constructor(
    private _route: ActivatedRoute,
    private _dataService: DataService,
    private _notify: AlertService,
    private _stateService: StateService,
    private _fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.questionId = +this._route.snapshot.paramMap.get('id');
    this.fetchQuestionById(this.questionId);
    this.fetchAnswersByQuestion(this.questionId);
    this.answerForm = this._fb.group({
      desc: ['', [Validators.required]]
    })
  }

  fetchAnswersByQuestion(id: number) {
    this._dataService.fetchAnswersByQuestionId(id)
      .subscribe(
        respObj => {
          this._stateService.questionDetailState.questionId = this.questionId;
          this._stateService.questionDetailState.answerList = respObj;
          this.answerList = this._stateService.questionDetailState.answerList;
          this.answerCount = this._stateService.questionDetailState.answerList.length;
        },
        err => {
          this._notify.error(err);
        }
      )
  }

  fetchQuestionById(id: number) {
    this._dataService.fetchQuestionById(id)
      .subscribe(
        respObj => {
          this._stateService.questionDetailState.questionDesc = respObj['desc'];
          this.questionDesc = respObj['desc'];
        },
        err => {
          this._notify.error(err);
        }
      )
  }

  onNewAnswerSubmit() {
    const userId: number = this._stateService.userState.userId;
    if (!this.answerForm.valid) this._notify.warning('Answer cannot be empty');
    this._dataService.createAnswerByUserAndQuestion(this.answerForm.value, userId, this.questionId)
      .subscribe(_ => {
        this._notify.success('You wrote an answer!');
        this.fetchAnswersByQuestion(this.questionId);
        this.closeButtonEl.nativeElement.click();
      },
        err => {
          this._notify.error(err);
        })
  }

  deleteAnswer(id: number){
    this._dataService.deleteAnswerById(id)
      .subscribe(_=>{
        this.fetchAnswersByQuestion(this.questionId);      },
      err=>{
        this._notify.error(err)
      })
  }

}
