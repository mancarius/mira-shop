import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { Route } from 'src/app/shared/enums/route';
import { CartItem } from 'src/app/shared/interfaces/cart-item';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject();
  public items$: Observable<CartItem[]> = this._cart.items$.pipe(
    takeUntil(this._unsubscribe$)
  );
  public itemsLength$: BehaviorSubject<number | null> = this._cart.length$;
  public routes = Route;

  constructor(private _cart: CartService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
