import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Base } from '../models/base';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocket.service';
import { filter, map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WsMessagesService {
  //   updateUser: { income: string; money: string };
  //   activeBases;

  updateUser$: Observable<any>;
  updateBases$: Observable<any>;

  #updateUser$: Subject<any>;
  #updateBases$: Subject<any>;

  constructor(public wsService: WebsocketService) {
    this.#updateUser$ = new ReplaySubject(1);
    this.#updateBases$ = new ReplaySubject(1);
    this.updateUser$ = this.#updateUser$.asObservable();
    this.updateBases$ = this.#updateBases$.asObservable();

    //TEMPORAIRE (juste là pour les tests, à changer lorsqu'on aura implémenté la GeoLoc)
    this.wsService.send({
      command: 'updateLocation',
      userId: '619377f6806e604c76aa3bb6',
      location: {
        type: 'Point',
        coordinates: [46.779917, 6.637648],
      },
    });

    this.wsService.listen().subscribe((data) => {
      if (data.command === 'updateUser') {
        this.#updateUser$.next({
          income: data.params.income,
          money: data.params.money,
        });
      } else if (data.command === 'updateBases') {
        this.#updateBases$.next(data.params);
      }
    });
  }
}
