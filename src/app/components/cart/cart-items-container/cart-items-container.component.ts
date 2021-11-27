import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/shared/interfaces/cart-item';

@Component({
  selector: 'app-cart-items-container',
  templateUrl: './cart-items-container.component.html',
  styleUrls: ['./cart-items-container.component.scss'],
})
export class CartItemsContainerComponent implements OnInit {
  private _unsubscribe$ = new Subject();
  public items$: Observable<CartItem[]> = this._cart.items$.pipe(
    takeUntil(this._unsubscribe$)
  );

  constructor(private _cart: CartService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
