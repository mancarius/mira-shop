import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AdminSession } from '../shared/interfaces/admin-session';
import { AdminAuthenticationService } from './admin-authentication.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public state$: Observable<{
    user: firebase.User | null;
    admin: AdminSession | null | undefined;
  }> = combineLatest([
    this._userAuth.authState$,
    this._adminAuth.session$,
  ]).pipe(
    map(([user, admin]) => ({ user, admin })),
    shareReplay(1)
  );

  constructor(
    private _userAuth: AuthenticationService,
    private _adminAuth: AdminAuthenticationService
  ) {}

  public logout(): void {
    try {
      this._userAuth.logout();
      this._adminAuth.logout();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
