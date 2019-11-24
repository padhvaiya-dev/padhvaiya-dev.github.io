import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from '../../environments/environment';
import { throwError, BehaviorSubject, Observable, queueScheduler } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  createUser = (userObj: object) => {
    return this._http.post(environment.apiUrl + '/users', userObj)
      .pipe(catchError(this.handleError))
  }

  login = (userObj: object) => {
    const email: string = userObj['email'];
    return this._http.post<any>(environment.apiUrl + '/auth/login', userObj)
      .pipe(
        catchError(this.handleError),
        map(user => {
          if (user && user.token) {
            localStorage.setItem('loggedInUser', email);
            localStorage.setItem('currentUser', JSON.stringify({
              _id: user['_id'],
              first_name: user['first_name'],
              last_name: user['last_name'],
              email: user['email'],
              token: user['token'],
              questions: user['questions'],
              answers: user['answers']
            }));
            this.currentUserSubject.next(user);
          }
          return user;
        }))

  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loggedInUser')
    this.currentUserSubject.next(null);
    this._router.navigateByUrl('/login');
  }

  fetchQuestions() {
    return this._http.get<any>(environment.apiUrl + '/questions')
      .pipe(catchError(this.handleError))
  }

  fetchLoggedInUserId() {
    return this._http.get<any>(environment.apiUrl + '/users/me')
      .pipe(catchError(this.handleError))
  }

  fetchUserById(id: string) {
    return this._http.get<any>(environment.apiUrl + '/users/' + id)
      .pipe(catchError(this.handleError))
  }

  fetchAnswersByQuestionId(questionId: string): Observable<any> {
    return this._http.get(environment.apiUrl + '/answers/question/' + questionId)
      .pipe(catchError(this.handleError))
  }

  fetchAnswersByUser(userId: string) {
    return this._http.get(environment.apiUrl + '/answers/user/' + userId)
      .pipe(catchError(this.handleError));
  }

  fetchQuestionById(questionId: string) {
    return this._http.get(environment.apiUrl + '/questions/' + questionId)
      .pipe(catchError(this.handleError));
  }

  fetchQuestionsByUser(userId: string) {
    return this._http.get(environment.apiUrl + '/questions/user/' + userId)
      .pipe(catchError(this.handleError));
  }

  fetchCollegeList() {
    return this._http.get(environment.apiUrl + '/colleges')
      .pipe(catchError(this.handleError));
  }

  createQuestionByUser(questionPayload: object, userId: string, imageFile?: File) {
    const formData = new FormData();
    formData.append('desc', questionPayload['desc']);
    formData.append('userId', userId)
    formData.append('file', imageFile);
    return this._http.post(environment.apiUrl + '/questions', formData)
      .pipe(catchError(this.handleError))
  }

  createAnswerByUserAndQuestion(answerPayload: object, userId: string, questionId: string, imageFile?: File) {
    const formData = new FormData();
    formData.append('desc', answerPayload['desc']);
    formData.append('userId', userId);
    formData.append('questionId', questionId);
    formData.append('file', imageFile);
    return this._http.post(environment.apiUrl + '/answers/', formData)
      .pipe(catchError(this.handleError))
  }

  deleteQuestionById(questionId: number) {
    return this._http.delete(environment.apiUrl + '/questions/' + questionId)
      .pipe(catchError(this.handleError))
  }

  deleteAnswerById(answerId: string) {
    return this._http.delete(environment.apiUrl + '/answers/' + answerId)
      .pipe(catchError(this.handleError))
  }

  searchByQuestion(searchQuery: string) {
    return this._http.get(environment.apiUrl + '/search')
      .pipe(catchError(this.handleError));
  }

  updateCoverImage(image: File): Observable<Response> {
    const formData = new FormData();
    formData.append('image', image);
    return this._http.post<any>(environment.apiUrl + '/users/file-upload', formData)
      .pipe(catchError(this.handleError))
  }

  changeImage(image: File, imageType: string, userId: string) {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('userId', userId);
    formData.append('imageType', imageType);
    return this._http.post(environment.apiUrl + '/files/changePicture', formData)
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(error.error.message);
    } else {
      return throwError(error.error.error)
    }
  };

}
