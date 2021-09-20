import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProductService } from 'src/app/services/product.service';
import { CartItem } from 'src/app/shared/interfaces/cart-item';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  public product$: Promise<Product | undefined> = Promise.resolve(undefined);
  public productId: Product['id'] | undefined;
  public amount = new BehaviorSubject<CartItem['amount']>(1);

  constructor(
    private _product: ProductService,
    private _cart: CartService,
    private _route: ActivatedRoute,
    private _error: ErrorHandlerService
  ) {
    this._route.queryParams.subscribe((params) => {
      this.productId = params.productId;
      this.product$ = this._product.find(params.productId);
    });
  }

  ngOnInit(): void {}

  public addToCart(productId: Product['id']): void {
    this._cart
      .addItem(productId, this.amount.getValue())
      .then(() => {})
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
