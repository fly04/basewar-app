import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Base } from '../models/base';
import { Investment } from '../models/investment';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocket.service';
import { filter, map } from 'rxjs/operators';

const URL = `${environment.apiUrl}/bases`;

@Injectable({
  providedIn: 'root',
})
export class BasesService {
  constructor(public http: HttpClient, public wsService: WebsocketService) {
    this.wsService
      .listen()
      .pipe(
        filter((message) => message.command === 'updateBases'),
        map((message) => message.params)
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  getBase(id: string): Observable<Base> {
    return this.http.get<Base>(`${URL}/${id}`);
  }

  getBases(): Observable<Base[]> {
    return this.http.get<Base[]>(URL);
  }

  getUserBases(userID): Observable<Base[]> {
    return this.http.get<Base[]>(`${URL}?ownerId=${userID.id}`);
  }

  getInvestments(id: string): Observable<any> {
    const url = `${URL}/${id}/investments`;
    return this.http.get<Investment[]>(url);
  }

  patchBaseName(id: string, newBaseName: string): Observable<any> {
    const url = `${URL}/${id}`;
    return this.http.patch(url, { name: newBaseName });
    // ERROR HANDLER A IMPLEMENTER
    // .pipe(catchError(this.handleError('patchUserName')));
  }
}
