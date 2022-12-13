import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromLogin from './login/login.reducer';


export interface State {

  [fromLogin.loginFeatureKey]: fromLogin.State;
}

export const reducers: ActionReducerMap<State> = {

  [fromLogin.loginFeatureKey]: fromLogin.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
