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
  userStat: { income: string; money: string };
  activeBases: any;

  constructor(public http: HttpClient, public wsService: WebsocketService) {
    this.wsService
      .listen()
      .pipe(
        filter((message) => message.command === 'updateUser'),
        map((message) => message.params)
      )
      .subscribe((data) => {
        this.userStat = {
          income: data.income,
          money: data.money,
        };
      });
  }

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

  //TEMPORAIRE (juste là pour les tests, à changer lorsqu'on aura implémenté la GeoLoc)
  sendMessage() {
    this.wsService.send({
      command: 'updateLocation',
      userId: '619416ab66443fe3f139851c',
      location: {
        type: 'Point',
        coordinates: [46.781171, 6.646842],
      },
    });
    console.log('sent!');
  }
}
