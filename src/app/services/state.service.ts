import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  userState = {
    userId: null,
    firstName: '',
    lastName: '',
    email: '',
    questionsCount: 0,
    answersCount: 0,
    questionList: null,
    answerList:null,
    collegeList: null
  }

  questionDetailState = {
    questionId: null,
    answerList: null,
    questionList: null,
    questionDesc: null
  }

}
