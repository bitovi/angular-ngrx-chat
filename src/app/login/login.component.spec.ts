import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoginPartialState } from '../store/login/login.model';
import * as LoginActions from '../store/login/login.actions';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore<LoginPartialState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [provideMockStore({}), FormBuilder],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    it('should mark form as touched', () => {
      expect(component['form'].touched).toBe(false);
      component.submit();
      expect(component['form'].touched).toBe(true);
    });

    describe('when form is valid', () => {
      const mock = {
        username: 'some-username',
        password: 'some-password',
      };

      beforeEach(() => {
        component['form'].setValue(mock);
      });

      it('should have a valid form', () => {
        // Verify that form is truly valid for upcoming tests
        expect(component['form'].valid).toBe(true);
      });

      it('should dispatch LoginActions.login', () => {
        // TODO: Spy on dispatching action
        const spy = spyOn(store, 'dispatch');

        component.submit();

        // TODO: Verify that LoginActions.login action was dispatched
        expect(spy).toHaveBeenCalledOnceWith(LoginActions.login(mock));
      });
    });

    describe('when form is NOT valid', () => {
      const mock = {
        username: 'some-username',
        password: '', // password is required
      };

      beforeEach(() => {
        component['form'].setValue(mock);
      });

      it('should NOT have a valid form', () => {
        // Verify that form is truly invalid for upcoming tests
        expect(component['form'].valid).toBe(false);
      });

      it('should NOT dispatch LoginActions.login', () => {
        // TODO: Spy on dispatching action
        const spy = spyOn(store, 'dispatch');

        component.submit();

        // TODO: Verify that no action was dispatched
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
