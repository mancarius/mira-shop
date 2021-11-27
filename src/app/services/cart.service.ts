import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../shared/interfaces/cart-item';
import firebase from 'firebase/app';
import { Cart } from '../shared/interfaces/cart';
import { Product } from '../shared/interfaces/product';
import { ConsItemService as Item } from './cons-item.service';
import { map, takeUntil } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { CartRemoteService } from './cart-remote.service';
import * as _ from 'lodash';
import { CartLocalService } from './cart-local.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public items$: ReplaySubject<CartItem[]> = new ReplaySubject<CartItem[]>(1);
  private _cart: Cart | null = null;
  public length$: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);
  private _itemSrv = new Item(this._afs);
  private _unsubscribe$ = new Subject();
  private _customer: firebase.User | null = null;

  constructor(
    private _afs: AngularFirestore,
    private _auth: AuthService,
    private _local: CartLocalService,
    private _remote: CartRemoteService,
    private _error: ErrorHandlerService
  ) {
    this.cart = this.cart;

    this._auth.state$.pipe(map(({ user }) => user)).subscribe((user) => {
      // prevent duplicated emits
      if (user && !this._customer) {
        this._customer = user;
        this._subscribeRemote(user.uid);
      } else if (!user && this._customer) {
        this._customer = null;
        this._unsubscribeRemote();
        this.cart = null;
      }
    });
  }

  /**
   *
   *
   * @private
   * @memberof CartService
   */
  private _subscribeRemote(documentId: firebase.User['uid']): void {

    this._remote.init(documentId);

    this._remote.cart$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((remoteCart) => {
        if (remoteCart) {
          if (this.cart) {
            const lastUpdateLocal = new firebase.firestore.Timestamp(
              this.cart.lastUpdate.seconds,
              this.cart.lastUpdate.nanoseconds
            );
            const lastUpdateRemote = remoteCart.lastUpdate;

            // local cart is more recent
            if (lastUpdateLocal.valueOf() > lastUpdateRemote.valueOf()) {
              const remoteItems = remoteCart.items;
              const localItems = this.cart.items;
              const mergedItems = _.uniqBy(
                [...remoteItems, ...localItems],
                'sku'
              );
              this.cart = { ...this.cart, items: mergedItems };
            } else {
              this.cart = remoteCart;
            }
            // clear local cart
            this._local.clear();
          } else {
            this.cart = remoteCart;
          }
        } else {
          this.cart = null;
        }
      });
  }

  /**
   *
   *
   * @private
   * @memberof CartService
   */
  private _unsubscribeRemote(): void {
    this._remote.destroy();
    this._unsubscribe$.next();
  }

  /**
   *
   *
   * @readonly
   * @private
   * @type {(Cart | null)}
   * @memberof CartService
   */
  private get cart(): Cart | null {
    const isCart = !!this._cart;
    const isCustomer = this._customer !== null;
    if (!isCart && !isCustomer) {
      const localCart = this._local.get();
      const isLocalCart = !!localCart;
      if (isLocalCart) {
        return localCart;
      } else {
        return CartService.emptyCart;
      }
    }
    return this._cart;
  }

  /**
   *
   *
   * @private
   * @type {void}
   * @memberof CartService
   */
  private set cart(value: Cart | null) {
    if (!value) {
      this._clearCart();
      return;
    }

    const lastUpdate = firebase.firestore.Timestamp.now();
    this._cart = { ...value, lastUpdate };
    this._cart.subtotal = CartService.getSubtotal(this._cart.items);
    this.items$.next(this._cart.items);
    this.length$.next(CartService.getItemsLength(this._cart.items));
    this._customer
      ? this._remote.update(this._cart)
      : this._local.update(this._cart);
  }

  /**
   *
   *
   * @private
   * @memberof CartService
   */
  private _clearCart(): void {
    this.items$.next([]);
    this.length$.next(null);
    this._cart = null;
    this._customer
      ? this._remote.update(this._cart)
      : this._local.update(this._cart);
  }

  /**
   *
   *
   * @readonly
   * @static
   * @type {Cart}
   * @memberof CartService
   */
  public static get emptyCart(): Cart {
    const timestamp = firebase.firestore.Timestamp.now();

    return {
      createdAt: timestamp,
      lastUpdate: timestamp,
      items: [],
      subtotal: 0,
    };
  }

  /**
   *
   *
   * @private
   * @static
   * @param {CartItem[]} items
   * @return {*}  {number}
   * @memberof CartService
   */
  public static getItemsLength(items: CartItem[]): number {
    if (items && items.length) {
      let itemsAmount = items.reduce(
        (previous, current) => Number(previous) + Number(current.amount),
        0
      );

      return Number(itemsAmount);
    } else {
      return 0;
    }
  }

  /**
   *
   *
   * @private
   * @static
   * @param {CartItem[]} items
   * @return {*}  {number}
   * @memberof CartService
   */
  public static getSubtotal(items: CartItem[]): number {
    if (items && items.length) {
      let subtotal = items.reduce(
        (previous, current) =>
          Number(previous) + Number(current.amount) * Number(current.price),
        0
      );

      return Number(subtotal);
    } else {
      return 0;
    }
  }

  /**
   *
   *
   * @private
   * @param {Product['id'] | Product['sku']} id item ID or SKU
   * @param {number} [quantity=1]
   * @return {*}  {Promise<void>}
   * @memberof CartService
   */
  private async _addNewItem(
    id: Product['id'] | Product['sku'],
    quantity = 1
  ): Promise<void> {
    let product: Product | null;
    let cartItems = this.cart?.items ?? [];

    try {
      product =
        (await this._itemSrv.findById(id as string)) ||
        (await this._itemSrv.findBySku(id as string));
      if (product === null) {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw error;
    }

    const newItem: CartItem = {
      createdAt: firebase.firestore.Timestamp.now(),
      amount: quantity,
      id: product.id as string,
      sku: product.sku,
      price: product.price,
      currency: product.currency,
    };

    cartItems.push(newItem);

    try {
      this.update({
        items: cartItems,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update the cart items
   * @param sku
   * @param value
   */
  public updateItem(sku: string, value: Partial<CartItem>): void {
    let items = this.cart?.items;
    if (items?.length) {
      items = items.map((item) => {
        return item.sku === sku ? { ...item, ...value } : item;
      });
      this.update({ items });
    }
  }

  /**
   * Update the cart or create if not exist
   * @param new_value
   * @returns
   */
  public update(value: Partial<Cart>): void {
    if (this.cart === null) {
      this.cart = this._create();
    }
    console.group('update cart');
    console.log('update', value);

    this.cart = { ...this.cart, ...value };
    console.groupEnd();
  }

  /**
   *
   *
   * @private
   * @memberof CartService
   */
  private _create(): Cart {
    return {
      createdAt: firebase.firestore.Timestamp.now(),
      lastUpdate: firebase.firestore.Timestamp.now(),
      subtotal: 0,
      items: [],
    };
  }

  /**
   *
   *
   * @param {Product['sku']} sku
   * @return {*}  {Promise<void>}
   * @memberof CartService
   */
  public removeItem(sku: Product['sku']): void {
    const cartItems = this.cart?.items || [];

    const index = cartItems.findIndex((item) => item.sku === sku);

    if (index !== -1) {
      cartItems.splice(index, 1);

      this.update({
        subtotal: CartService.getSubtotal(cartItems),
        items: cartItems,
      });
    }
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof CartService
   */
  public async delete(): Promise<void> {
    this._clearCart();
  }

  /**
   * Add new item if not already present, else increment item amount
   * @param {String} sku
   * @returns
   */
  public async addItem(
    sku: Product['sku'],
    quantity: number = 1
  ): Promise<void> {
    try {
      if (this.containsItem(sku)) {
        const currentQty = this.getItem(sku)?.amount || 0;
        return this.updateItem(sku, {
          amount: currentQty + quantity,
        });
      } else {
        return this._addNewItem(sku, quantity);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if the item is already present in the cart and return true if present
   * @param {String} productID item ID or SKU
   * @returns {Boolean}
   */
  public containsItem(id: Product['id'] | Product['sku']): boolean {
    return (
      this.cart?.items.some(
        (item: CartItem) => item.id === id || item.sku === id
      ) ?? false
    );
  }

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof CartService
   */
  public get subtotal(): number {
    return this.cart?.subtotal ?? 0;
  }

  /**
   *
   *
   * @param {(Product['id'] | Product['sku'])} id
   * @return {*}  {(CartItem | null)}
   * @memberof CartService
   */
  public getItem(id: Product['id'] | Product['sku']): CartItem | null {
    return (
      this.cart?.items.find((item) => item.id === id || item.sku === id) ?? null
    );
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._clearCart();
    this.items$.complete();
    this.length$.complete();
  }

  /**
   *
   *
   * @static
   * @param {(Cart | null | undefined)} source
   * @param {(Cart | null | undefined)} test
   * @return {*}  {boolean}
   * @memberof CartService
   */
  public static _isChanged(
    source: Cart | null | undefined,
    test: Cart | null | undefined
  ): boolean {
    if (!!source && !!test) {
      const { lastUpdate: remove1, ...sourceFiltered } = source;
      const { lastUpdate: remove2, ...testFiltered } = test;

      return !_.isEqual(sourceFiltered, testFiltered);
    }

    return !!source !== !!test;
  }
}
