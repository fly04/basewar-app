import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocket.service';
import { filter, map, catchError } from 'rxjs/operators';

const URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(public http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(URL);
    //ERROR HANDLER A IMPLEMENTER
  }

  getUser(id: string): Observable<User> {
    const url = `${URL}/${id}`;
    return this.http.get<User>(url);
    //ERROR HANDLER A IMPLEMENTER
  }

  postUser(user: User): Observable<User> {
    const url = `${URL}/${user.id}`;
    return this.http.post<User>(url, user);
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
