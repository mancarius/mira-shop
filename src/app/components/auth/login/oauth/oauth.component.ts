import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss'],
})
export class OauthComponent implements OnInit {
  public isLoggedIn: boolean = false;

  constructor(
    private _auth: AuthenticationService,
    private _error: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this._auth.authState$.subscribe(
      (state) => (this.isLoggedIn = state !== null)
    );
  }

  public facebookLogin() {
    this._auth.facebookLogin().catch((error: any) => {
      console.error(error);
      this._error
        .add(error)
        .and.showMessage('The access failed. ' + error.message);
    });
  }

  public logout() {
    this._auth.logout();
  }
}
