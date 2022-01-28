import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Base } from 'src/app/models/base';
import { Investment } from 'src/app/models/investment';
import { InvestmentToCreate } from 'src/app/models/investment-to-create';
import { environment } from 'src/environments/environment';
import { WebsocketService } from '../websocket/websocket.service';
import { catchError, filter, map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { BaseToCreate } from 'src/app/models/base-to-create';

const URL = `${environment.apiUrl}/bases`;

@Injectable({
  providedIn: 'root',
})
export class BasesService {
  constructor(public http: HttpClient) {}

  getBase(id: string): Observable<Base> {
    return this.http.get<Base>(`${URL}/${id}`);
  }

  getBases(): Observable<Base[]> {
    return this.http.get<Base[]>(URL);
  }

  getUserBases(user: User): Observable<Base[]> {
    return this.http.get<Base[]>(`${URL}?ownerId=${user.id}`);
    // ERROR HANDLER A IMPLEMENTER
    // .pipe(catchError(this.handleError('patchUserName')));
  }

  postBase(baseToCreate: BaseToCreate): Observable<Base> {
    const url = `${URL}`;
    return this.http.post<Base>(url, baseToCreate);
  }

  getInvestments(id: string): Observable<any> {
    const url = `${URL}/${id}/investments`;
    return this.http.get<Investment[]>(url);
    // ERROR HANDLER A IMPLEMENTER
    // .pipe(catchError(this.handleError('patchUserName')));
  }

  postInvestment(investment: InvestmentToCreate): Observable<Investment> {
    const url = `${URL}/${investment.baseId}/investments`;
    return this.http.post<Investment>(url, investment);
    //ERROR HANDLER A IMPLEMENTER
    // .pipe(catchError(this.handleError('postInvestement', investment)));
  }

  patchBaseName(id: string, newBaseName: string): Observable<any> {
    const url = `${URL}/${id}`;
    return this.http.patch(url, { name: newBaseName });
    // ERROR HANDLER A IMPLEMENTER
    // .pipe(catchError(this.handleError('patchUserName')));
  }
}
