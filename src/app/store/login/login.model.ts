export interface LoginState {
  userId: string | null;
  username: string | null;
  token: string | null;
}

export interface LoginResponse {
  userId: string;
  token: string;
}

export const initialState: LoginState = {
  userId: null,
  username: null,
  token: null,
};

export const LOGIN_FEATURE_KEY = 'login';

export interface LoginPartialState {
  readonly [LOGIN_FEATURE_KEY]: LoginState;
}
