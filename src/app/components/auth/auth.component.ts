import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs/operators';
import { Route } from 'src/app/shared/enums/route';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  private redirectTo: string = '/';

  constructor(private _auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      params => this.redirectTo = params.target ?? Route.shop
    );
  }

  ngOnInit(): void {
    this._auth.state$.subscribe(
      ({user}) => {
        if (user !== null) {
          this.router.navigate([this.redirectTo]);
        }
      },
      error => console.error(error)
    );
  }

  get isAutenticated$(): Observable<firebase.User | null> {
    return this._auth.state$.pipe(map(({user}) => user));
  }

}
