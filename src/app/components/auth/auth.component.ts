import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  private redirectTo: string = '/';

  constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(
      params => this.redirectTo = params.target ?? '/'
    );
  }

  ngOnInit(): void {
    this.auth.authState$.subscribe(
      state => {
        console.log(state);
        if (state !== null) {
          this.router.navigate([this.redirectTo]);
        }
      },
      error => console.error(error)
    );
  }

  get isAutenticated$(): Observable<firebase.User | null> {
    return this.auth.authState$;
  }

}
