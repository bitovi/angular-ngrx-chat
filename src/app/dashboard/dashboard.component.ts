import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout } from '../store/login/login.actions';
import { selectUserId, selectUsername } from '../store/login/login.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Select username from store
  readonly username$ = this.store.select(selectUsername);

  // Select user ID from store
  readonly userId$ = this.store.select(selectUserId);

  constructor(private store: Store) {}

  logout(): void {
    this.store.dispatch(logout());
  }
}
