import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as LoginActions from '../store/login/login.actions';
import { selectUserId, selectUsername } from '../store/login/login.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Select username from store
  // TODO: Replace `of('TODO')` with selectUsername selector
  readonly username$ = of('TODO'); //this.store.select(selectUsername);

  // Select user ID from store
  // TODO: Replace `of('TODO')` with selectUserId selector
  readonly userId$ = of('TODO'); //this.store.select(selectUserId);

  constructor(private store: Store) {}

  logout(): void {
    // TODO: Dispatch LoginActions.logout action
    this.store.dispatch(LoginActions.logout());
  }
}
