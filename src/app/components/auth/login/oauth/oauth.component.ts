import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']
})
export class OauthComponent implements OnInit {

  public isLoggedIn: boolean = false;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.auth.authState$.subscribe((state) => this.isLoggedIn = state !== null);
  }

  facebookLogin() {
    this.auth.facebookLogin();
  }

  logout() {
    this.auth.logout();
  }

}
