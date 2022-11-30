import {
  initialState,
  LoginPartialState,
  LOGIN_FEATURE_KEY,
} from './login.model';
import * as LoginSelectors from './login.selectors';

describe('Login Selectors', () => {
  let state: LoginPartialState;

  beforeEach(() => {
    state = {
      [LOGIN_FEATURE_KEY]: {
        ...initialState,
        userId: 'some-user-id',
        username: 'some-username',
        token: 'some-token',
      },
    };
  });

  describe('selectUserId', () => {
    it('should return userId from login state', () => {
      const result = LoginSelectors.selectUserId(state);

      expect(result).toBe('some-user-id');
    });
  });

  describe('selectUsername', () => {
    it('should return username from login state', () => {
      const result = LoginSelectors.selectUsername(state);

      expect(result).toBe('some-username');
    });
  });

  describe('selectToken', () => {
    it('should return token from login state', () => {
      const result = LoginSelectors.selectToken(state);

      expect(result).toBe('some-token');
    });
  });
});
