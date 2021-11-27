import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { Route } from 'src/app/shared/enums/route';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public user: any = null;
  public admin: any = null;
  public cartLength: number | null = null;

  @Input() title: string = '';

  constructor(
    private _auth: AuthService,
    private _cart: CartService,
    private _router: Router
  ) {
    this._auth.state$.subscribe(
      ({ user, admin }) => {
        this.user = user;
        this.admin = admin;
      },
      (error) => console.error(error)
    );
  }

  ngOnInit(): void {
    this._cart.length$.subscribe((length) => {
      if (length && length > 0) this.cartLength = length;
      else this.cartLength = null;
    })
  }

  goToCart(): void {
    this._router.navigate(['/', ...Route.cart.split('/')]);
  }
}