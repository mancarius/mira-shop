import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user: any = null;

  constructor(private authService: AuthenticationService, public cart: CartService, private router: Router) {
    this.authService.authState$.pipe(
      map(data => {
        if(data) {
          const {displayName, photoURL} = data;
          return {displayName, photoURL};
        }
        return null;
      })
    ).subscribe(
      user => this.user = user,
      error => console.error(error)
    );
  }

  ngOnInit(): void {
    console.log('header', this.user);
  }

  goToCart(): void {
    this.router.navigate(['cart']);
  }

  logoutAndRedirect(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  

}
