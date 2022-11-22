import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginState, LOGIN_FEATURE_KEY } from './login.model';

export const selectLoginState =
  createFeatureSelector<LoginState>(LOGIN_FEATURE_KEY);
// export const selectUserData = createSelector(selectLoginState, state => ({
//   userId: state.userId,
//   username: state.username,
// }));

export const selectUserId = createSelector(
  selectLoginState,
  state => state.userId
);

export const selectUsername = createSelector(
  selectLoginState,
  state => state.username
);

export const selectToken = createSelector(
  selectLoginState,
  state => state.token
);
