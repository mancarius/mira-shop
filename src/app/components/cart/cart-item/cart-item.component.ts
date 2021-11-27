import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ConsItemService } from 'src/app/services/cons-item.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Route } from 'src/app/shared/enums/route';
import { CartItem } from 'src/app/shared/interfaces/cart-item';
import { Product } from 'src/app/shared/interfaces/product';
import { DialogTemplateComponent } from '../../dialog-template/dialog-template.component';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit {
  @Input() cartItem: CartItem | undefined;
  public product$: Subject<Product | null> = new Subject();
  public routes = Route;

  constructor(
    private _item: ConsItemService,
    private _cart: CartService,
    private _error: ErrorHandlerService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (typeof this.cartItem === 'object') {
      this._item
        .findById(this.cartItem.id)
        .then((data) => {
          if (!data) {
            this.product$.complete();
            throw new Error('Item not found');
          }

          this.product$.next(data);
        })
        .catch((error: any) => {
          console.error(error);
          this._error.add(error).and.showMessage(error.message);
        });
    }
  }

  /**
   * Update the cart item amount.
   * @param {Number} new_amount
   */
  private _updateAmount(new_amount: number): void {
    if (new_amount && this.cartItem) {
      this._cart.updateItem(this.cartItem.sku, {
        amount: Number(new_amount),
      });
    }
  }

  /**
   * Open dialog and wait for an input by user. If user confirm, then close dialog and remove item from cart.
   *
   */
  public openDialogAndRemoveItemIfUserConfirm(): void {
    const dialogRef = this._openDialog();

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.cartItem) {
        try {
          this._cart.removeItem(this.cartItem?.sku);
        } catch (error: any) {
          this._error.add(error);
        }
      }
    });
  }

  /**
   * Open dialog with given template and content and return a MatDialog Reference object
   *
   * @returns
   */
  private _openDialog(): MatDialogRef<DialogTemplateComponent, any> {
    return this._dialog.open(DialogTemplateComponent, {
      data: {
        title: 'Confirm Remove',
        content: 'Are you sure you want to remove this product from your cart?',
        action: 'Remove',
        action_color: 'warn',
      },
    });
  }

  public setAmount(amount: CartItem['amount']): void {
    this._updateAmount(amount);
  }
}
