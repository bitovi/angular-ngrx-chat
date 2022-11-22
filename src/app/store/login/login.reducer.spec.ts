import { Action } from '@ngrx/store';
import * as LoginActions from './login.actions';
import { LoginState, initialState } from './login.model';
import { reducer } from './login.reducer';

describe('Auth Reducer', () => {
  describe('loginSuccess action', () => {
    it('should update the state in an immutable way', () => {
      // Expectation of new state
      const expectedState: LoginState = {
        ...initialState,
        userId: 'some-user-id',
        username: 'some-username',
        token: 'some-token',
      };

      const action = LoginActions.loginSuccess({
        userId: 'some-user-id',
        username: 'some-username',
        token: 'some-token',
      });

      const state = reducer({ ...initialState }, action);

      // Compare new state
      expect(state).toEqual(expectedState);

      // Check for immutability
      expect(state).not.toBe(expectedState);
    });
  });

  describe('logoutSuccess action', () => {
    it('should update the state in an immutable way', () => {
      const action = LoginActions.logoutSuccess();

      const state = reducer(
        {
          ...initialState,
          userId: 'some-user-id',
          username: 'some-username',
          token: 'some-token',
        },
        action
      );

      // Compare new state
      expect(state).toBe(initialState);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {
        type: 'Unknown',
      } as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
