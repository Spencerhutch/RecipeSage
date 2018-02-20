import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';

/*
  Generated class for the RecipeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RecipeServiceProvider {

  base: any;

  constructor(public http: HttpClient) {
    console.log('Hello RecipeServiceProvider Provider');
    
    this.base = localStorage.getItem('base') || '/';
  }
  
  getTokenQuery() {
    return '?token=' + localStorage.getItem('token');
  }
  
  fetch() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    return this.http
    .get(this.base + 'recipes/' + this.getTokenQuery(), data, httpOptions)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  create(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http
    .post(this.base + 'recipes/' + this.getTokenQuery(), data, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
  
  update(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http
    .put(this.base + 'recipes/' + data.recipeId + this.getTokenQuery(), data, httpOptions)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  remove(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http
    .delete(this.base + 'recipes/' + data.recipeId + this.getTokenQuery(), data, httpOptions)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable({
      msg: 'Something bad happened; please try again later.',
      status: error.status
    });
  }
}