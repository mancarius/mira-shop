import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ConsItemService } from 'src/app/services/cons-item.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackyBarService } from 'src/app/services/snacky-bar.service';
import { Route } from 'src/app/shared/enums/route';
import { CartItem } from 'src/app/shared/interfaces/cart-item';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  public product$: Promise<Product | null> = Promise.resolve(null);
  public sku: Product['sku'] | undefined;
  public amount = new BehaviorSubject<CartItem['amount']>(1);
  public routes = Route;

  constructor(
    private _item: ConsItemService,
    private _cart: CartService,
    private _route: ActivatedRoute,
    private _error: ErrorHandlerService,
    private _snacky: SnackyBarService
  ) {
    this._route.queryParams.subscribe((params) => {
      this.sku = params.sku;
      this.product$ = this._item.findBySku(params.sku);
    });
  }

  ngOnInit(): void {}

  public addToCart(): void {
    this._cart
      .addItem(this.sku as string, this.amount.getValue())
      .then(() => {
        this._snacky.open('Item added to cart');
      })
      .catch((error) => {
        console.error(error);
        this.setAmountToPreviousValue();
        this._error.add(error).and.showMessage('Ops, an error occured');
      });
  }

  private setAmountToPreviousValue(): void {
    const subscription = this.amount
      .pipe(startWith(1), pairwise())
      .subscribe(([prevAmount, curAmount]) => {
        if (prevAmount !== curAmount) {
          this.amount.next(prevAmount);
          subscription.unsubscribe();
        }
      });
  }

  public setAmount(amount: number): void {
    this.amount.next(amount);
  }
}
