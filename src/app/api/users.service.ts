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
  userStat: { income: string; money: string };

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

  getUser(id: number): Observable<User> {
    const url = `${URL}/${id}`;
    return this.http.get<User>(url);
    //ERROR HANDLER A IMPLEMENTER
  }

  //TEMPORAIRE (juste là pour les tests, à changer lorsqu'on aura implémenté la GeoLoc)
  sendMessage() {
    this.wsService.send({
      command: 'updateLocation',
      userId: '619377f6806e604c76aa3bb6',
      location: {
        type: 'Point',
        coordinates: [46.781171, 6.646842],
      },
    });
    console.log('sent!');
  }
}
