import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectToken } from '../store/login/login.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate, CanLoad {
  private readonly guard$ = this.store.select(selectToken).pipe(
    map(token => {
      if (token) {
        return true;
      }
      return this.router.createUrlTree(['']);
    })
  );

  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<UrlTree | boolean> {
    return this.guard$;
  }

  canLoad():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.guard$;
  }
}
