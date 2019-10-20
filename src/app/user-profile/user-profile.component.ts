import { Component, OnInit, Renderer2, ViewChild, ElementRef, Directive, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { StateService } from '../services/state.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertService } from '../services/alert.service';



class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  currentUser: any;
  askQuestionForm: FormGroup
  isFirstActive: boolean = true;
  selectedFile: ImageSnippet;
  isDisabled: boolean = false;


  @ViewChild('quesTab', { static: false }) public quesTabEl: ElementRef;
  @ViewChild('ansTab', { static: false }) public ansTabEl: ElementRef;
  @ViewChild('userTab', { static: true }) public userTabEl: ElementRef;
  @ViewChild('productTab', { static: true }) public productTabEl: ElementRef;
  @ViewChild('questionSettings', { static: false }) public questionSettingsEl: ElementRef;
  @ViewChild('closeButton', { static: false }) public closeButtonEl: ElementRef;

  constructor(
    private _datatService: DataService,
    private _stateService: StateService,
    private _renderer: Renderer2,
    private _fb: FormBuilder,
    private _notify: AlertService
  ) { }

  ngOnInit() {
    this.fetchUserDetails();
    this.currentUser = this._stateService.userState;
    this.askQuestionForm = this._fb.group({
      desc: ['', [Validators.required]]
    })
  }

  deleteQuestion(id: number) {
    this._datatService.deleteQuestionById(id)
      .subscribe(_ => {
        this.fetchUserDetails();
      },
        err => {
          this._notify.error(err);
        })
  }

  deleteAnswer(id: number){
    this._datatService.deleteAnswerById(id)
      .subscribe(_=>{
        this.fetchUserDetails();
      },
      err=>{
        this._notify.error(err)
      })
  }

  onNewQuestionSubmit() {
    const userId: number = this._stateService.userState.userId;
    if (!this.askQuestionForm.valid) return this._notify.warning('Question cannot be empty');
    this._datatService.createQuestionByUser(this.askQuestionForm.value, userId)
      .subscribe(_ => {
        this.fetchUserDetails();
        this.closeButtonEl.nativeElement.click();
      },
        err => {
          this._notify.error(err);
        })
  }

  fetchUserDetails() {
    this._datatService.fetchLoggedInUserId()
      .subscribe(respObj => {
        const userId: number = respObj['id'];
        this._datatService.fetchUserById(userId)
          .subscribe(respObj => {
            this._stateService.userState.userId = respObj['id'];
            this._stateService.userState.email = respObj['email'];
            this._stateService.userState.firstName = respObj['firstName'];
            this._stateService.userState.lastName = respObj['lastName'];
            this._stateService.userState.questionList = respObj['questions'];
            this._stateService.userState.answerList = respObj['answers'];
            this._stateService.userState.questionsCount = respObj['questions'].length;
            this._stateService.userState.answersCount = respObj['answers'].length;
            this.currentUser = this._stateService.userState;
          }, err => {
            this._notify.error(err);
          })
      },
        err => {
          this._notify.error(err)
        })
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this._datatService.updateCoverImage(this.selectedFile.file).subscribe(
        res => {

        },
        err => {

        })
    });
    reader.readAsDataURL(file);
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
