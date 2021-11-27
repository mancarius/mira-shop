import { Injectable } from '@angular/core';
import { Cart } from '../shared/interfaces/cart';

@Injectable({
  providedIn: 'root',
})
export class CartLocalService {

  constructor() {}

  /**
   * Update the cart or create if not exist
   * @param new_value
   * @returns
   */
  public update(value: Cart | null): void {
    if (!value) this.clear();
    else this._write(value);
  }

  /**
   *
   *
   * @private
   * @memberof CartService
   */
  private _write(cart: Cart) {
    const stringified = JSON.stringify(cart).trim();
    sessionStorage.setItem('cart', stringified);
  }

  /**
   *
   *
   * @memberof CartLocalService
   */
  public clear(): void {
    sessionStorage.removeItem('cart');
  }

  /**
   *
   *
   * @return {*}  {(Cart | null)}
   * @memberof CartLocalService
   */
  public get(): Cart | null {
    const stringified = sessionStorage.getItem('cart');
    return stringified ? JSON.parse(stringified) : null;
  }

}
