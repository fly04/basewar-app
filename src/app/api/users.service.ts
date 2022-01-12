import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocket.service';
import { filter, map, tap, catchError } from 'rxjs/operators';

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

  getUser(id: number): Observable<User> {
    const url = `${URL}/${id}`;
    return this.http.get<User>(url);
    //ERROR HANDLER A IMPLEMENTER
  }
}
