import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private _http: HttpClient
  ) { }

  createUser = (userObj: object) => {
    return this._http.post(environment.apiUrl + '/users', userObj)
      .pipe(catchError(this.handleError))
  }

  login = (userObj: object) => {
    return this._http.post(environment.apiUrl + '/users/login', userObj)
      .pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(error.error.message);
    } else {
      return throwError(error.error)
    }
  };

}
