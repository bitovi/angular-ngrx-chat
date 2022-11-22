import { Action, createReducer, on } from '@ngrx/store';
import * as LoginActions from './login.actions';
import { initialState, LoginState } from './login.model';

export const loginReducer = createReducer(
  initialState,
  // login reducer
  on(
    LoginActions.loginSuccess,
    (state, { userId, username, token }): LoginState => ({
      ...state,
      userId,
      username,
      token,
    })
  ),
  on(LoginActions.logoutSuccess, (): LoginState => initialState)
);

export function reducer(state: LoginState | undefined, action: Action) {
  return loginReducer(state, action);
}
