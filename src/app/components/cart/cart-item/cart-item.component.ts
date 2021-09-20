import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProductService } from 'src/app/services/product.service';
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
  public product$: Promise<Product | undefined> | Promise<null> =
    Promise.resolve(null);
  public amount: number = 1;

  constructor(
    private _product: ProductService,
    private _cart: CartService,
    private _error: ErrorHandlerService,
    private _dialog: MatDialog
  ) {}



  ngOnInit(): void {
    if (this.cartItem) {
      try {
        this.product$ = this._product.find(this.cartItem.id);
      } catch (error: any) {
        console.error(error);
        this._error.add(error);
      }
    }
  }

  /**
   * Update the cart item amount.
   * @param {Number} new_amount
   */
  private _updateAmount(new_amount: number): void {
    if (new_amount && this.cartItem) {
      this._cart
        .updateItem(this.cartItem.id, {
          amount: Number(new_amount),
        })
        .catch((error: Error) => {
          this._error.add(error);
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
          this._cart.removeItem(this.cartItem?.id);
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
      },
    });
  }

  public setAmount(amount: CartItem['amount']): void {
    this._updateAmount(amount);
  };
}