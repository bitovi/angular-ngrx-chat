import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export interface State {
  userId: string | null;
  username: string | null;
  token: string | null;
}

export const initialState: State = {
  userId: null,
  username: null,
  token: null,
};

export const reducer = createReducer(
  initialState,

  on(AuthActions.loginSuccess, (state, { userId, username, token }) => ({
    ...state,
    userId,
    username,
    token,
  })),
  on(AuthActions.logout, () => initialState)
);
