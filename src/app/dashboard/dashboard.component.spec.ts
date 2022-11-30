import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as LoginActions from '../store/login/login.actions';
import {
  LoginPartialState,
  LOGIN_FEATURE_KEY,
} from '../store/login/login.model';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore<LoginPartialState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        MockStore,
        provideMockStore({
          initialState: {
            [LOGIN_FEATURE_KEY]: {
              userId: 'some-user-id',
              username: 'some-username',
              token: 'some-token',
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout()', () => {
    it('should dispatch logout action', () => {
      const spy = spyOn(store, 'dispatch');
      component.logout();
      expect(spy).toHaveBeenCalledOnceWith(LoginActions.logout());
    });
  });

  describe('username$', () => {
    it('should get username from login state', done => {
      component.username$.subscribe(username => {
        expect(username).toBe('some-username');
        done();
      });
    });
  });

  describe('userId$', () => {
    it('should get userId from login state', done => {
      component.userId$.subscribe(userId => {
        expect(userId).toBe('some-user-id');
        done();
      });
    });
  });
});
