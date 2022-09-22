import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import * as LoginActions from './login.actions';
import { LoginService } from './login.service';

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
        switchMap(() => this.router.navigate(['chat']))
      );
    },
    { dispatch: false }
  );

  changeUsername$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.usernameChange),
      exhaustMap(({ username }) =>
        this.loginService.changeUsername(username).pipe(
          map(() => LoginActions.usernameChangeSuccess()),
          catchError((error: unknown) =>
            of(
              LoginActions.usernameChangeFailure({
                errorMsg: this.getErrorMessage(error),
              })
            )
          )
        )
      )
    );
  });

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
