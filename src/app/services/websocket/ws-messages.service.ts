import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Base } from '../../models/base';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocket.service';
import { filter, map, tap, catchError } from 'rxjs/operators';
import { UserStat } from 'src/app/models/user-stat';
import { BaseUpdate } from 'src/app/models/base-update';
import { NotificationData } from 'src/app/models/notification-data';

@Injectable({
  providedIn: 'root',
})
export class WsMessagesService {
  updateUser$: Observable<UserStat>;
  updateBases$: Observable<BaseUpdate[]>;
  visitorNotification$: Observable<NotificationData>;

  #updateUser$: Subject<UserStat>;
  #updateBases$: Subject<BaseUpdate[]>;
  #visitorNotification$: Subject<NotificationData>;

  constructor(public wsService: WebsocketService) {
    this.#updateUser$ = new ReplaySubject(1);
    this.#updateBases$ = new ReplaySubject(1);
    this.#visitorNotification$ = new ReplaySubject(1);

    this.updateUser$ = this.#updateUser$.asObservable();
    this.updateBases$ = this.#updateBases$.asObservable();
    this.visitorNotification$ = this.#visitorNotification$.asObservable();

    this.wsService.listen().subscribe((data) => {
      if (data.command === 'updateUser') {
        this.#updateUser$.next({
          income: data.params.income,
          money: data.params.money,
        });
      } else if (data.command === 'updateBases') {
        this.#updateBases$.next(data.params);
      } else if (data.command === 'notification') {
        //PS: Le message websocket ayant comme paramètre "notification" n'est jamais reçu suite à un bug de l'API
        this.#visitorNotification$.next(data.params);
      }
    });
  }
}
