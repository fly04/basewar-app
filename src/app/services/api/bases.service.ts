import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base } from '../../models/base';
import { environment } from 'src/environments/environment';
import { WebsocketService } from '../websocket/websocket.service';
import { filter, map, tap, catchError } from 'rxjs/operators';

const URL = `${environment.apiUrl}/bases`;

@Injectable({
  providedIn: 'root',
})
export class BasesService {
  activeBases: any[];

  constructor(public http: HttpClient, public wsService: WebsocketService) {}

  getBases(): Observable<Base[]> {
    return this.http.get<Base[]>(URL);
  }

  getUserBases(userID): Observable<Base[]> {
    return this.http.get<Base[]>(`${URL}?ownerId=${userID.id}`);
  }
}
