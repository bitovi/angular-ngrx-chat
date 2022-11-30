import { Component } from '@angular/core';
import { of } from 'rxjs';

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

  logout(): void {
    // TODO: Dispatch LoginActions.logout action
  }
}
