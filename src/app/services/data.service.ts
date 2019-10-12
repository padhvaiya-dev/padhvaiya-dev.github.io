import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from '../../environments/environment';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
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
    return this._http.post<any>(environment.apiUrl + '/users/login', userObj)
      .pipe(
        catchError(this.handleError),
        map(user => {
          if (user && user.token) {
            localStorage.setItem('loggedInUser', email);
            localStorage.setItem('currentUser', JSON.stringify(user));
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

  fetchUserById(id: number) {
    return this._http.get<any>(environment.apiUrl + '/users/' + id)
      .pipe(catchError(this.handleError))
  }

  fetchAnswersByQuestionId(questionId: number) {
    return this._http.get(environment.apiUrl + '/questions/' + questionId + '/answers')
      .pipe(catchError(this.handleError))
  }

  fetchQuestionById(questionId: number) {
    return this._http.get(environment.apiUrl + '/questions/' + questionId)
      .pipe(catchError(this.handleError));
  }

  createQuestionByUser(questionPayload: object, userId: number) {
    questionPayload['userId'] = userId
    return this._http.post(environment.apiUrl + '/users/' + userId + '/questions', questionPayload)
      .pipe(catchError(this.handleError))
  }

  createAnswerByUserAndQuestion(answerPayload: object, userId: number, questionId: number) {
    answerPayload['userId'] = userId;
    answerPayload['questionId'] = questionId;
    return this._http.post(environment.apiUrl + '/questions/' + questionId + '/answers', answerPayload)
      .pipe(catchError(this.handleError))
  }

  deleteQuestionById(questionId: number) {
    return this._http.delete(environment.apiUrl + '/questions/' + questionId)
      .pipe(catchError(this.handleError))
  }

  deleteAnswerById(answerId: number) {
    return this._http.delete(environment.apiUrl + '/answers/' + answerId)
      .pipe(catchError(this.handleError))
  }

  updateCoverImage(image: File): Observable<Response> {
    const formData = new FormData();
    formData.append('image', image);
    return this._http.post<any>(environment.apiUrl + '/users/file-upload', formData)
      .pipe(catchError(this.handleError))
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(error.error.message);
    } else {
      return throwError(error.message)
    }
  };

}
