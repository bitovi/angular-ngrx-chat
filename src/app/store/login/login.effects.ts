import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import * as LoginActions from './login.actions';
import { LoginService } from '../../services/login.service';

@Injectable()
export class LoginEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.login),
      exhaustMap(({ username, password }) =>
        this.loginService.login({ username, password }).pipe(
          map(({ userId, token }) =>
            LoginActions.loginSuccess({ userId, username, token })
          ),
          catchError((error: unknown) =>
            of(
              LoginActions.loginFailure({
                errorMsg: this.getErrorMessage(error),
              })
            )
          )
        )
      )
    );
  });

  loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LoginActions.loginSuccess),
        switchMap(() => this.router.navigate(['dashboard']))
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.logout),
      exhaustMap(() =>
        this.loginService.logout().pipe(
          map(() => LoginActions.logoutSuccess()),
          catchError((error: unknown) =>
            of(
              LoginActions.logoutFailure({
                errorMsg: this.getErrorMessage(error),
              })
            )
          )
        )
      )
    );
  });

  logoutSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LoginActions.logoutSuccess),
        switchMap(() => this.router.navigate(['']))
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private loginService: LoginService,
    private router: Router
  ) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
