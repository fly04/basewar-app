import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base } from '../models/base';
import { environment } from 'src/environments/environment';

const URL = `${environment.apiUrl}/bases`;

@Injectable({
  providedIn: 'root',
})
export class BasesService {
  constructor(public http: HttpClient) {}

  getBases(): Observable<Base[]> {
    return this.http.get<Base[]>(URL);
  }

  getUserBases(userID): Observable<Base[]> {
    return this.http.get<Base[]>(`${URL}?ownerId=${userID.id}`);
  }
}
