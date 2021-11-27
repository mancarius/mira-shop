import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
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
export class SelectItemAmountComponent implements OnInit, OnChanges {
  @Input() itemId: Product['sku'] | undefined;
  @Input() quantity: number = 1;
  @Output() onAmountChange: EventEmitter<CartItem['amount']> = new EventEmitter<
    CartItem['amount']
  >();

  public quantityControl = new FormControl(this.quantity, [
    Validators.required,
    Validators.min(1),
    Validators.max(10),
  ]);

  constructor(
    private _cart: CartService,
    private _error: ErrorHandlerService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.quantity.currentValue !== changes.quantity.previousValue) {
      this.quantityControl.setValue(changes.quantity.currentValue);
    }
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
      curAmount && this.quantityControl.setValue(curAmount);
    }
  }

  private subscribeEmitterToAmountValueChanges(): void {
    this.quantityControl.valueChanges.subscribe((value) => {
      this.onAmountChange.emit(value);
    });
  }
}