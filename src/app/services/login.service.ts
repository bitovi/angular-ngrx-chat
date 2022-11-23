import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, timer } from 'rxjs';
import { LoginResponse } from '../store/login/login.model';
import { v4 } from 'uuid';

/**
 * Used for generating auth token and userId
 */
export interface Credentials {
  username: string;
  password: string;
}

/**
 * Authentication service used to generate and manage auth token
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  /**
   * Used for logging purposes when using logout
   */
  loginResponse: LoginResponse | null = null;

  /**
   * Login user using username and password
   *
   * @param credentials {LoginResponse} - username and password
   * @param debug {boolean} (default is true)
   * @returns token string and userId string
   */
  login(credentials: Credentials, debug = true): Observable<LoginResponse> {
    const { username, password } = credentials;

    return this.delay().pipe(
      map(() => {
        if (password.length < 6) {
          throw new Error('password length must be at least 6 characters long');
        }

        if (username.length < 3) {
          throw new Error('username length must be at least 3 characters long');
        }

        if (!/^[A-Za-z0-9-_]+$/.test(username)) {
          throw new Error(
            'username must only include alphanumeric, hyphens, or underscores'
          );
        }

        if (username.toLowerCase() === 'bitovi') {
          throw new Error('"bitovi" username is already taken');
        }

        return {
          userId: v4(),
          token: v4(),
        };
      }),
      tap(loginResponse => {
        this.loginResponse = loginResponse;
        if (debug) {
          console.log(
            `%cLogin API request for ${username} is successful`,
            'color: green',
            loginResponse
          );
        }
      }),
      catchError((error: unknown) => {
        if (debug) {
          this.logError(error);
        }

        throw error;
      })
    );
  }

  /**
   * Logout user from current session. If there is no current session, return value is `null`
   *
   * @param debug {boolean} (default is true)
   * @returns token string and userId string or null
   */
  logout(debug = true): Observable<LoginResponse | null> {
    return this.delay().pipe(
      map(() => this.loginResponse ?? null),
      tap(() => {
        if (debug) {
          if (this.loginResponse) {
            console.log(
              `%cLogout API request is successful for token: ${this.loginResponse.token}`,
              'color: green',
              this.loginResponse
            );
          } else {
            console.log(`%cLogout API request is successful`, 'color: green');
          }
        }

        this.loginResponse = null;
      }),
      catchError((error: unknown) => {
        if (debug) {
          this.logError(error);
        }

        throw error;
      })
    );
  }

  /**
   * Observable helper for short randomized delay
   *
   * @returns milliseconds of delay
   */
  delay(): Observable<number> {
    const milliseconds = 300 + Math.random() * 500;

    return timer(milliseconds).pipe(map(() => milliseconds));
  }

  /**
   * Logs error message
   *
   * @param error {Error} error instance
   */
  logError(error: unknown): void {
    if (error instanceof Error) {
      console.log(`%c${error.message}`, 'color: red');
    } else {
      console.log(`%cUnexpected error`, 'color: red');
    }
  }
}
