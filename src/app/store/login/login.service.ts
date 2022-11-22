import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginResponse } from './login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  /**
   *
   * @param credentials
   * @returns token string
   */
  login(credentials: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    credentials;
    return of({ userId: crypto.randomUUID(), token: 'dummy-token' });
    // return this.http
    //   .post(this.URL, { params: credentials })
    //   .pipe(map(() => 'to-do token selection from header'));
  }

  /**
   *
   * @param credentials
   * @returns token string
   */
  logout(): Observable<null> {
    return of(null);
  }
}
