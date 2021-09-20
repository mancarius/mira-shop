import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { CartItem } from 'src/app/shared/interfaces/cart-item';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-select-item-amount',
  templateUrl: './select-item-amount.component.html',
  styleUrls: ['./select-item-amount.component.scss'],
})
export class SelectItemAmountComponent implements OnInit {
  @Input() itemId: Product['id'] | undefined;
  @Output() onAmountChange: EventEmitter<CartItem['amount']> = new EventEmitter<
    CartItem['amount']
  >();

  public amount = new FormControl(1, [
    Validators.required,
    Validators.min(1),
    Validators.max(10),
  ]);

  constructor(
    private _cart: CartService,
    private _error: ErrorHandlerService
  ) {
  }

  ngOnInit(): void {
    try {
      this._initAmount();
      this.subscribeEmitterToAmountValueChanges();
    } catch (err: any) {
      console.error(err);
      this._error.add(err).and.showMessage('An error has occurred');
    }
  }

  private get _isValidItemId(): boolean {
    return typeof this.itemId === 'string';
  }

  private _initAmount(): void {
    if (this._isValidItemId) {
      const curAmount = this._cart.getItem(this.itemId as string)?.amount;
      curAmount && this.amount.setValue(curAmount);
    }
  }

  private subscribeEmitterToAmountValueChanges(): void {
    try {
      this.amount.valueChanges.subscribe((value) => {
        this.onAmountChange.emit(value);
      });
    } catch (err: any) {
      throw new Error(err?.message ?? err);
    }
  }
}