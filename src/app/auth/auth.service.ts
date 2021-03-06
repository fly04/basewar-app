import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, from } from 'rxjs';
import { map, delayWhen } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';
import { AuthRequest } from '../models/auth-request';
import { environment } from 'src/environments/environment';
import { ThrowStmt } from '@angular/compiler';

/**
 * Authentication service for login/logout.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  #auth$: ReplaySubject<AuthResponse | undefined>;
  #auth: AuthResponse | undefined;
  notification: string;

  constructor(private http: HttpClient, private storage: Storage) {
    this.#auth$ = new ReplaySubject(1);
    this.storage.get('auth').then((auth) => {
      this.#auth = auth;
      // Emit the loaded value into the observable stream.
      this.#auth$.next(auth);
    });
  }

  isAuthenticated$(): Observable<boolean> {
    return this.#auth$.pipe(map((auth) => Boolean(auth)));
  }

  getUser$(): Observable<User> {
    return this.#auth$.pipe(map((auth) => auth?.user));
  }

  getToken$(): Observable<string> {
    return this.#auth$.pipe(map((auth) => auth?.token));
  }

  logIn$(authRequest: AuthRequest): Observable<User> {
    const authUrl = `${environment.apiUrl}/users/login`;
    return this.http.post<AuthResponse>(authUrl, authRequest).pipe(
      //Delay the observable stream while persisting the authentication response.
      delayWhen((auth) => this.saveAuth$(auth)),

      map((auth) => {
        this.#auth = auth;
        this.#auth$.next(auth);
        console.log(`User ${auth.user.name} logged in`);
        return auth.user;
      })
    );
  }

  notify(notification: string): void {
    this.notification = notification;
  }

  updateAuth(user: User): void {
    this.#auth.user = user;
    this.saveAuth$(this.#auth);
    this.#auth$.next(this.#auth);
  }

  logOut(): void {
    this.#auth$.next(null);
    this.#auth = undefined;
    console.log('User logged out');
  }

  private saveAuth$(auth: AuthResponse): Observable<void> {
    return from(this.storage.set('auth', auth));
  }
}
