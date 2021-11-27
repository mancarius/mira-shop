import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminAuthenticationService } from 'src/app/services/admin-authentication.service';
import { SnackyBarService } from 'src/app/services/snacky-bar.service';
import { Router } from '@angular/router';
import { AdminRoute } from 'src/app/shared/enums/admin-route';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase';
import { Route } from 'src/app/shared/enums/route';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class UserAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

@Component({
  selector: 'admin-auth',
  templateUrl: './admin-auth.component.html',
  styleUrls: ['./admin-auth.component.scss'],
})
export class AdminAuthComponent implements OnInit {
  private _user: firebase.User | null = null;
  private _unsubscribe$ = new Subject<void>();
  hide: boolean = true;
  isLoading: boolean = true;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private _snacky: SnackyBarService,
    private _auth: AuthService,
    private _adminAuth: AdminAuthenticationService,
    private _router: Router
  ) {
    this._auth.state$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(({ user, admin }) => {
        if (admin !== undefined) {
          this.isLoading = false;
        }
        this._user = user;
        const isAdminAuthed = user && admin && user.uid == admin.uid;

        if (isAdminAuthed) {
          this._router.navigate([AdminRoute.base]);
        }
      });
  }

  ngOnInit(): void {}

  public async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this._snacky.open('All fields ar required');
      return undefined;
    }

    this.isLoading = true;

    try {
      await this._login();
    } catch (err) {
      if (err instanceof UserAuthError) {
        this._userNotAuthed();
      }
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  private async _login(): Promise<void> {
    if (!this._user) {
      throw new Error('User not authenticated');
    }
    const { username, password } = this.loginForm.getRawValue();
    return this._adminAuth.login(
      username,
      password,
      this._user.displayName as string,
      this._user.uid as string
    );
  }

  private _userNotAuthed() {
    this._snacky.open('You need to authenticate first.');
    this._user = null;
    this._router.navigate([Route.auth + '?target=' + AdminRoute.base]);
  }

  ngOnDestroy() {
    // unsubscribe all subscrptions
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
