import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service';
import { StateService } from '../services/state.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {
  questionImgRef: string;
  hostName: string;
  loggedInUser: string;
  userName: string;
  userId: string;
  questionId: string;
  questionDesc: string;
  answerCount: number;
  answerList: Array<object> = [];
  answerForm: FormGroup;
  imgFile: File;
  @ViewChild('closeButton', { static: true }) public closeButton: ElementRef;
  constructor(
    private _route: ActivatedRoute,
    private _dataService: DataService,
    private _notify: AlertService,
    private _stateService: StateService,
    private _fb: FormBuilder,

  ) {
    this.hostName = environment.apiUrl;
    (JSON.parse(localStorage.getItem('currentUser'))) ? this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'))._id : this.loggedInUser = null;
    this.questionId = this._route.snapshot.paramMap.get('id').toString();
    this.fetchQuestionById(this.questionId);
  }

  ngOnInit() {
    this.fetchAnswersByQuestion(this.questionId);
    this.answerForm = this._fb.group({
      desc: ['', [Validators.required]]
    })
  }

  fetchQuestionById(id: string) {
    this._dataService.fetchQuestionById(id)
      .subscribe(
        respObj => {
          this._stateService.questionDetailState.questionDesc = respObj['desc'];
          this.questionDesc = respObj['desc'];
          this.questionImgRef = respObj['imgRef'];
          this.userId = respObj['userId']['_id'];
          this.userName = respObj['userId']['first_name'].concat(' ').concat(respObj['userId']['last_name']);
        },
        err => {
          this._notify.error(err);
        }
      )
  }

  fetchAnswersByQuestion(id: string) {
    this._dataService.fetchAnswersByQuestionId(id)
      .subscribe(
        respObj => {
          this._stateService.questionDetailState.answerList = [...respObj];
          this.answerList = [...respObj];
          this.answerCount = this._stateService.questionDetailState.answerList.length;
        },
        err => {
          this._notify.error(err);
        }
      )
  }



  onNewAnswerSubmit() {
    if (!this.answerForm.valid) this._notify.warning('Answer cannot be empty');
    this._dataService.createAnswerByUserAndQuestion(this.answerForm.value, this.loggedInUser, this.questionId, this.imgFile)
      .subscribe(_ => {
        this._notify.success('You wrote an answer!');
        this.closeButton.nativeElement.click();
        this.fetchAnswersByQuestion(this.questionId);
      },
        err => {
          this._notify.error(err);
        })
  }

  fileUpload(event) {
    this.imgFile = event.target.files[0];
  }

  deleteAnswer(id: string) {
    this._dataService.deleteAnswerById(id)
      .subscribe(_ => {
        this.fetchAnswersByQuestion(this.questionId);
      },
        err => {
          this._notify.error(err)
        })
  }

}
