import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Route } from 'src/app/shared/enums/route';

@Component({
  selector: 'app-private-menu',
  templateUrl: './private-menu.component.html',
  styleUrls: ['./private-menu.component.scss'],
})
export class PrivateMenuComponent implements OnInit {
  public user: any = null;

  constructor(private _auth: AuthService, private _router: Router) {
    this._auth.state$.subscribe(
      ({ user }) => (this.user = user),
      (error) => console.error(error)
    );
  }

  ngOnInit(): void {}

  logoutAndRedirect(): void {
    this._auth.logout();
    this._router.navigate([Route.shop]);
  }
}
