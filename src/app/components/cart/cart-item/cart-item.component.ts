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

  public amount = new FormControl(1, [
    Validators.required,
    Validators.min(1),
    Validators.max(10),
  ]);

  constructor(
    private _product: ProductService,
    private _cart: CartService,
    private _error: ErrorHandlerService,
    private _dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'cartItem': {
            if (this.cartItem && changes['cartItem'].isFirstChange) {
              this.amount.setValue(this.cartItem?.amount);
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
    if (this.cartItem) {
      console.log('Adding cart item', this.cartItem);
      try {
        this.product$ = this._product.find(this.cartItem.product.id);
      } catch (error: any) {
        this._error.add(error);
      }
    }

    this.amount.valueChanges.subscribe(this._updateAmount.bind(this));
  }

  /**
   * Update the cart item amount.
   * @param {Number} new_amount
   */
  private _updateAmount(new_amount: number): void {
    if (new_amount) {
      this._cart
        .updateItem(this.cartItem?.product.id, {
          amount: new_amount,
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
      if (result) {
        try {
          this._cart.removeItem(this.cartItem?.product.id);
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
}