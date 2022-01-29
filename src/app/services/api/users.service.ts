import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { filter, map, catchError } from 'rxjs/operators';
import { UserRegister } from '../../models/user-register';

const URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(public http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(URL).pipe(catchError((err) => of([err])));
  }

  getUser(id: string): Observable<User> {
    const url = `${URL}/${id}`;
    return this.http.get<User>(url).pipe(catchError((err) => of(err)));
  }

  postUser(user: UserRegister): Observable<User> {
    const url = `${URL}`;
    return this.http.post<User>(url, user);
  }

  deleteUser(id: string): Observable<User> {
    const url = `${URL}/${id}`;
    return this.http.delete<User>(url);
    //ERROR HANDLER A IMPLEMENTER
    // .pipe(catchError(this.handleError('postUser', user)));
  }

  patchUserName(id: string, newUserName: string): Observable<any> {
    const url = `${URL}/${id}`;
    return this.http.patch(url, { name: newUserName });
    // ERROR HANDLER A IMPLEMENTER
    // .pipe(catchError(this.handleError('patchUserName')));
  }
}
