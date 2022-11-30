import { Action, createReducer, on } from '@ngrx/store';
import * as LoginActions from './login.actions';

export const loginFeatureKey = 'login';

export interface State {

}

export interface LoginPartialState {
  [loginFeatureKey]: State;
}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState
);
